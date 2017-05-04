//config
const coroutineDelay = 500;
const reactive = true;

var Ximp = function(){
    this.condition = null;
    this.action = null;
    this.failureAction = null;
    this.doForeachInit = null;
    this.doForeach = false;
    this.args = [];
    this.dom;

    this.evaluateCondition = function(){
        this.condition = this.condition.replace(/\s/g, ''); //remove all spaces
        var iterPosition = 0;
        var conditionEntities = [];
        var connectives = [];
        while(this.condition.indexOf("(", iterPosition) != "-1"){
            var newIterPosition = this.condition.indexOf("(",iterPosition);
            //substring
            if(iterPosition != newIterPosition){
                var connective = this.condition.substring(iterPosition+1,newIterPosition);
                connectives.push(connective);
            }
            var closesAt = this.condition.indexOf(")",newIterPosition);
            if(closesAt == -1){
                console.log("Oopsie! You have an unclosed conditional in a ximp-if somewhere");
            }
            //substring
            var conditionEntity = this.condition.substring(newIterPosition+1,closesAt);
            conditionEntities.push(conditionEntity)
            iterPosition = closesAt;
        }
        var substitutions = [];
        for(var x = 0; x < conditionEntities.length ; x++){
            var e = conditionEntities[x];
            var idEnd = e.indexOf(".");
            var attrStart = e.indexOf(".")+1;
            var id = e.substring(0,idEnd);
            var attribute = e.substring(attrStart);
            var watching = document.getElementById(id);
            if (typeof watching != 'undefined' && watching) {
                if(attribute == "value" && reactive){
                    substitutions.push(watching.value);
                } else {
                    if(watching.hasAttribute(attribute)){
                        substitutions.push(watching.getAttribute(attribute))
                    } else {
                        console.log("Oopsie! Attribute does not exist for the given id : " + id);
                        substitutions.push(false);
                    }
                }
            } else {
                console.log("Element with id '" + id + "' does not exist, and will be treat as a string literal");
                substitutions.push(e) //if an id cannot be found, 
            }
        }
        var substitutionsPointer = 0;
        var statementResults = [];
        //resolving-connectives
        if(connectives.length == 0){
            if(substitutions[0] === "true" || substitutions[0] == true){
                var node = this.dom
                eval(this.action+"(node)"); //no args (just a reference to `this`)
            } else {
                if(this.failureAction != null){
                    var node = this.dom;
                    eval(this.failureAction+"(node)");
                }
            }
        } else {
            for(var x = 0; x < connectives.length; x++){
                var connective = connectives[x];
                if(connective == "EQ"){
                    var arg_1 = substitutions[substitutionsPointer];
                    var arg_2 = substitutions[substitutionsPointer+1];
                    if(arg_1 == arg_2){
                        statementResults.push(true);
                    } else {
                        statementResults.push(false);
                    }
                    substitutionsPointer = substitutionsPointer+2;
                    continue;
                }
                if(connective == "NE"){
                    var arg_1 = substitutions[substitutionsPointer];
                    var arg_2 = substitutions[substitutionsPointer+1];
                    if(arg_1 != arg_2){
                        statementResults.push(true);
                    } else {
                        statementResults.push(false);
                    }
                    substitutionsPointer = substitutionsPointer+2;
                    continue;
                }
                if(connective == "GT"){
                    var arg_1 = substitutions[substitutionsPointer];
                    var arg_2 = substitutions[substitutionsPointer+1];
                    if(arg_1 > arg_2){
                        statementResults.push(true);
                    } else {
                        statementResults.push(false);
                    }
                    substitutionsPointer = substitutionsPointer+2;
                    continue;
                }
                if(connective == "LT"){
                    var arg_1 = substitutions[substitutionsPointer];
                    var arg_2 = substitutions[substitutionsPointer+1];
                    if(arg_1 < arg_2){
                        statementResults.push(true);
                    } else {
                        statementResults.push(false);
                    }
                    substitutionsPointer = substitutionsPointer+2;
                    continue;
                }
                var arg_left = substitutions[substitutionsPointer];
                if(arg_left === "true" || arg_left == true){
                    statementResults.push(true);
                    substitutionsPointer = substitutionsPointer+1;
                } else if (arg_left === "false" || arg_left == false){
                    statementResults.push(false);
                    substitutionsPointer = substitutionsPointer+1;
                }
                if(x == connectives.length-1){
                    var arg_right = substitutions[substitutionsPointer];
                    if(arg_right === "true" || arg_right == true){
                        statementResults.push(true);
                        substitutionsPointer = substitutionsPointer+1;
                    } else if (arg_right === "false" || arg_right == false){
                        statementResults.push(false);
                        substitutionsPointer = substitutionsPointer+1;
                    }
                }
            }
            //remove evaluation-connectives
            for(var x = connectives.length; x > 0; x--){
                var connective = connectives[x-1];
                if(connective == "EQ" || connective == "LT" || connective == "GT" || connective == "NE"){
                    connectives.splice(x-1,1);
                }
            }
            //compound-evaluations
            var compoundResults = [];
            var statementResultsPointer = 0;
            if(connectives.length == 0){
                if(statementResults[0] == true){
                    var node = this.dom;
                    return true;
                    //eval(this.action+"(node)"); //no args (just a reference to `this`)
                } else {
                    if(this.failureAction != null){
                        var node = this.dom;
                        return false;
                        //eval(this.failureAction+"(node)");
                    }
                }
            } else {
                for(var x = 0; x < connectives.length; x++){
                    var connective = connectives[x];
                    if(connective == "AND"){
                        if(statementResults[statementResultsPointer] && statementResults[statementResultsPointer+1]){
                            compoundResults.push(true);
                            statementResultsPointer += 1;
                        } else {
                            compoundResults.push(false);
                            statementResultsPointer += 1;
                        }
                        continue;
                    }
                    if(connective == "OR"){
                        if(statementResults[statementResultsPointer] || statementResults[statementResultsPointer+1]){
                            compoundResults.push(true);
                            statementResultsPointer += 1;
                        } else {
                            compoundResults.push(false);
                            statementResultsPointer += 1;
                        }
                        continue;
                    }
                    statementResultsPointer += 1;
                }
                if(compoundResults.indexOf(false) == -1){
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

function evaluateAllXimpsCoroutine(){
    var ximps = document.querySelectorAll("[ximp]");
    for(var x = 0; x < ximps.length ; x++){
        var ximpDomNode = ximps[x];
        var currentXimp = new Ximp();
        if(ximpDomNode.hasAttribute("ximp-foreach")){
            if(ximpDomNode.getAttribute("ximp-foreach") == ""){
                
            }
        }
    }
    for(var x = 0; x < ximps.length ; x++){
        var ximpDomNode = ximps[x];
        var currentXimp = new Ximp();
        currentXimp.dom = ximpDomNode;
        if(ximpDomNode.hasAttribute("ximp-action")){
            currentXimp.action = ximpDomNode.getAttribute("ximp-action");
        }
        if(ximpDomNode.hasAttribute("ximp-action-failure")){
            currentXimp.failureAction = ximpDomNode.getAttribute("ximp-action-failure");
        }
        if(ximpDomNode.hasAttribute("ximp-if")){
            var condition = ximpDomNode.getAttribute("ximp-if");
            currentXimp.condition = condition;
        }
        if(ximpDomNode.hasAttribute("ximp-foreach")){
            currentXimp.doForeach = true;
        }
        if(ximpDomNode.hasAttribute("ximp-foreach-init")){
            currentXimp.doForeachInit = ximpDomNode.getAttribute("ximp-foreach-init");
        }
        var conditionPassed = true;
        if(currentXimp.condition != null){
            conditionPassed = currentXimp.evaluateCondition()
        }
        if(currentXimp.doForeach){
            eval(currentXimp.doForeachInit+"(currentXimp)");
            if(conditionPassed){
                var domChildren = ximpDomNode.children;
                for(var y = 0; y < domChildren.length ; y++){
                var cChild = domChildren[y];
                eval(currentXimp.action+"(cChild)");
                }
            }
        } else {
            if(conditionPassed){
                eval(currentXimp.action+"(ximpDomNode)");
            } else {
                if(currentXimp.failureAction != null){
                    eval(currentXimp.failureAction+"(ximpDomNode)");
                }
            }
        }

    }
    if(reactive){
        setTimeout(evaluateAllXimpsCoroutine,coroutineDelay);
    }
}

window.addEventListener("load",function(){
    evaluateAllXimpsCoroutine();
});