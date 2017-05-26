//config
const coroutineDelay = 500;
const reactive = true;

/**
 * Treats id.attribute strings simlarly to how reference.property strings work in other langauges
 * i.e.
 * `object1.myval`
 * would get the `myval` of object1 in an OOP langauge
 * here, it gets the tag with the id `object1` and returns it's attribute `myval`
 * if the string does not parse correctly (that is, without a property/attribute specified)
 * then it will return the string literal `e`
 * if a id.attribute combination does not exist in the page, it will return the string literal `e`
 * @param {string} e - the id.attribute string
 */
function parseTagProperty(e){
    var idEnd = e.indexOf(".");
    var attrStart = e.indexOf(".")+1;
    var id = e.substring(0,idEnd);
    var attribute = e.substring(attrStart);
    var watching = document.getElementById(id);
    if (typeof watching != 'undefined' && watching) {
        if(attribute == "value" && reactive){
            if(watching.type == "checkbox"){
                if(watching.checked == true){
                    return "true";
                } else if (watching.checked == false){
                    return "false";
                }
            }
            return watching.value; //this must be here, as the value -attribute- on the tag does not update, even if the actual value does
        } else {
            if(watching.hasAttribute(attribute)){
                return watching.getAttribute(attribute);
            } else {
                console.log("Oopsie! Attribute does not exist for the given id : " + id + ", and so will be treat as a string literal");
                return e;
            }
        }
    } else {
        console.log("Element with id '" + id + "' does not exist, and will be treat as a string literal");
        return e;
    }
}

function evaluateRelationalStatement(conditionalConnective, lh, rh){
    if(conditionalConnective == "EQ"){
        if(lh == rh){
            return true;
        } else {
            return false;
        }
    }
    if(conditionalConnective == "NE"){
        if(lh != rh){
            return true;
        } else {
            return false;
        }
    }
    if(conditionalConnective == "GT"){
        if(lh > rh){
            return true;
        } else {
            return false;
        }
    }
    if(conditionalConnective == "LT") {
        if (lh < rh) {
            return true;
        } else {
            return false;
        }
    }
    return null;
}

function evaluateLogicalStatement(logicalConnective, lh, rh){
    if(logicalConnective == "AND"){
        if(lh && rh){
            return true;
        } else {
            return false;
        }
    }
    if(logicalConnective == "OR"){
        if(lh || rh){
            return true;
        } else {
            return false;
        }
    }
}

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
            substitutions.push(parseTagProperty(e));
        }
        var substitutionsPointer = 0;
        var statementResults = [];
        //resolving-connectives
        if(connectives.length == 0){
            if(substitutions[0] === "true" || substitutions[0] == true){
                return true;
            } else {
                if(this.failureAction != null){
                    return false;
                }
            }
        } else {
            /*
             * evaluate relational statements
             */
            for(var x = 0; x < substitutions.length; x++){
                var connective = connectives[x];
                if(connective == "EQ" || connective  == "NE" || connective == "GT" || connective == "LT"){
                    var arg_1 = substitutions[substitutionsPointer];
                    var arg_2 = substitutions[substitutionsPointer+1];
                    var result = evaluateRelationalStatement(connective, arg_1, arg_2);
                    statementResults.push(result);
                }
                substitutionsPointer = substitutionsPointer+1;
            }
            /*
             * remove relational connectives (oprands)
             */
            for(var x = connectives.length; x > 0; x--){
                var connective = connectives[x-1];
                if(connective == "EQ" || connective == "LT" || connective == "GT" || connective == "NE"){
                    connectives.splice(x-1,1);
                }
            }
            /*
             * evaluate logical statements
             */
            var compoundResults = [];
            while(statementResults[1] != null){
                var connective = connectives[0];
                var result = null;
                if(connective == "AND" || connective == "OR" ) {
                    var lh = statementResults[0]; //base
                    var rh = statementResults[1]; //head
                    result = evaluateLogicalStatement(connective, lh, rh);
                }
                //remove zero-th connective
                connectives.shift();
                statementResults.splice(0,2,result);
            }
            /*
             * return zeroth index, the compound result of the statement
             */
            return statementResults[0];
        }
    }
};

function evaluateAllXimpsCoroutine(){
    var ximps = document.querySelectorAll("[ximp]");
    for(var x = 0; x < ximps.length ; x++){
        var ximpDomNode = ximps[x];
        var currentXimp = new Ximp();
    }
    for(var x = 0; x < ximps.length ; x++){
        var ximpDomNode = ximps[x];
        var currentXimp = new Ximp();
        currentXimp.dom = ximpDomNode;
        /*
         * For testing
         */
        if(ximpDomNode.id == "connectiveConditionTest"){
            console.log("fortesting");
        }
        /*
         * End for testing
         */
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
        if(ximpDomNode.hasAttribute("ximp-args")){
            currentXimp.args = [];
            var argsString = ximpDomNode.getAttribute("ximp-args");
            var argsArray = argsString.split(","); //parge the args as a comma spertaed list
            for(var y = 0; y < argsArray.length; y++){
                var literalArg = argsArray[y];
                var value = parseTagProperty(literalArg);
                argsArray[y] = value;
            }
            currentXimp.args = argsArray;
        }
        var conditionPassed = true;
        if(currentXimp.condition != null){
            conditionPassed = currentXimp.evaluateCondition()
        }
        var argsArray = currentXimp.args;
        var argsString = "";
        for(var u = 0 ; u < argsArray.length ; u++){
            argsString += ",'";
            var arg = argsArray[u];
            argsString += arg;
            argsString += "'";
        }
        argsString += ")";
        if(currentXimp.doForeach){
            eval(currentXimp.doForeachInit+"(currentXimp"+argsString);
            if(conditionPassed){
                var domChildren = ximpDomNode.children;
                for(var y = 0; y < domChildren.length ; y++){
                    var cChild = domChildren[y];
                    eval(currentXimp.action+"(cChild"+argsString);
                }
            }
        } else {
            if(conditionPassed){
                eval(currentXimp.action+"(ximpDomNode"+argsString);
            } else {
                if(currentXimp.failureAction != null){
                    eval(currentXimp.failureAction+"(ximpDomNode"+argsString);
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