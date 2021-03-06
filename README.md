# ximp.js
Ximp.js (eXplicitly IMPerative) is a small tool used to implement logical control in your HTML tags through ximp's custom attributes.

The premise is simple. Ximp.js lets you use your actual HTML as your data. Your variables are now your input tags, and can be accessed via ximp's special statements.

It's hot garbage and uses not-at-all modern js. I mainly wrote it as a joke, and to "fix" crazy javascript + server side rendered code I've stumbled over.

Using ximp.js means you don't need the boilerplate you would normally need to use in javascript in order to implement logical control over your HTML. Ximp.js is about getting a lot of things done on the front end when deadlines are tight and you don't have time to learn the latest cool way of doing things in js (and you don't trust all thse new fangled words going around in the javascript eco - "compilation", "bundling", "preproccessing", bah humbug I say! setTimeout callbacks are all the asynchronous programming I'll ever need in the browser!)

It allows you to easily write how your javascript interacts with your HTML. Ximp.js takes care of the "<i>how</i>" you access your HTML, leaving you to focus entirely on the "<i>what</i>" of your functions in javascript.

I made it because I wanted to use the cool power of directives without the need for the data binding, models, or controllers. With ximp.js, there's no need for ANY setup besides dropping the file in your project and importing it using a script tag. You can immidately start using ximp's custom directives. Ximp.js is perfect for web projects that have constantly evolving requirements, conditional flows based on user input, and online wizards. Ximp.js makes implementing these easy. When your primary source of data is embedded in the HTML/DOM itself, ximp.js is what you need.

Here is a typical usage example :

```
<head>
  <style>
    #hiddenMessage{
      display:none;
    }
  </style>
  <script src="ximp.js"></script>
  <script>
    function showme(that){
      that.style.display = "block";
    }
  </script>
</head>
<body>
  <input id="test-input">
  <div id="hiddenMessage" ximp ximp-if="(test-input.value) EQ (Hello!)" ximp-action="showme">
    Why, hello back!
  </div>
</body>
```

When a user enters the text "Hello!", a message will appear to greet them!

The general structure of a ximp.js expression (the bit inside the `ximp-if` attribute) is as follows : 

`(T) r (T) n (T) r (T)`

Where `T` represents either a literal value OR is a token speicifying the id and attribute it is to watch (i.e. `id.attribute`, such as in the above example), this may be the id of ANY tag, and the attribute must be ANY attribute that tag has. `n` represents a "Connective". Connectives represent a combination of the typical relational and logical operators you would find in other langauges such as `==`, `!=`, `<`, `>`,`&&`, and `||`. Instead of these symboles, ximp.js uses the fortran style of `EQ` for equality, `NE` for non-equality, `LT` for less-than, `GT` for greater than and `AND`+`OR` appropriately (Because variety is the spice of life). The parenthesis are not optional.

In the cases where no relational connective (`EQ`,`NE`,`LT`,`GT`) is provided, it is assumed the value `true` is expected for success, and all others for failure.

<u>Examples of Correctly Formed statements</u>
<br/>
`(id.attribute)`<br/>
`(id.attribute) EQ (id.attribute)`<br/>
`(id.attribute) LT (id.attribute) AND (id.attribute) GT (id.attribute)`<br/>
`(id.attribute) NE (id.attribute) AND (id.attribute) EQ (true) AND (id.attribute) EQ (id.attribute)`<br/>
<br/>
<u>Examples of Incorrectly Formed statements</u>
<br/>
`(id.attribute) EQ (id.attribute) EQ (id.attribute)` <br/>
`(id.attribute) (id.attribute)` <br/>
`(id.attribute) AND EQ (id.attribute)` <br/>
`(id.attribute) EQ (id.attribute) AND` <br/>
`(id.attribute) AND (id.attribute) GT (id.attribute)` <br/>
`(id.attribute) LT (id.attribute) AND (id.attribute) GT` <br/>
`(id.attribute) AND (id.attribute)` <br/>
<br/>

If no connectives are present (EQ, AND, etc), the default ximp expression will be `(whateveryoupassed)EQ(true)`. It is recommended that you <i>always</i> pass a relational operator (EQ, NE, GT, LT,. etc.).

Methods that are named in `ximp-action` or `ximp-action-failure` will always be passed the DOM object of the tag they are associated with.

At present the <b>default</b> behaviour of ximp is to run as a couroutine (evaluate all conditions, then evaluate them repeatedly for the lifecycle of the page). Understandably if this is not what you want, you can modify the const values at the top of the ximp.js file (`const reactive = true` & `const coroutineDelay = 500` - to adjust how long the process should sleep for in between evaluations, if at all).

You can use `ximp-foreach` in order to apply `ximp-action` to all children elements, using `ximp-foreach-init` will run the specified callback once before running `ximp-action` on child elements.

i.e. 

```
<ul ximp ximp-foreach ximp-foreach-init="initFunction" ximp-action="onEachChildFunction">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

You could include a `ximp-if` attribute in order to conditionally run the for-each (`ximp-foreach-init` will still run, reguardless of condition passing or failing).

```
<ul ximp ximp-foreach ximp-if="(x.value)GT(y.value)" ximp-foreach-init="initFunction" ximp-action="onEachChildFunction">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

Ximp has the `ximp-args` attribute to pass <i>additional</i> arguments to functions named in `ximp-action` and `ximp-action-failure`.
A reference to the dom object will still always be passed as the first argument. You may also pass arguments in the form of `id.attribute`, as in conditionals (see `ximp-if`). Arguments are comma seperated.

i.e.

```
<script src="ximp.js"></script>
<script>
  function addArgsAndSetValue(domObject,x,y){
    domObject.value = parseInt(x) + parseInt(y);
  }
  
  function alertUser(domObject, value){
    alert("inputWithArgs' value is " + value + "!");
  }
</script>
<input ximp ximp-args="3,3" ximp-action="addArgsAndSetValue" id="inputWithArgs" type="text"></input>
<div ximp ximp-if="(inputWithArgs.value)EQ(6)" ximp-args="inputWithArgs.value" ximp-action="alertUser"></div>
```
