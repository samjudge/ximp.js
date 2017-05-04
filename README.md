# ximp.js
Ximp.js (eXplicitly IMPerative) is a small tool used to implement logical control in your HTML tags through ximp's custom attributes. It is specifically targetted for newer developers so I can get them into bad habits early (jk). It's porbably a bit (very) buggy, so make an issue (or even a test case) if you find anything!

Using ximp.js means you don't need the boilerplate you would normally need to use in javascript in order to implement logical control over your HTML, or when using javascript to add dynamic control over your page would normally be impractical due to it's size, or when you would use ajax to update what would otherwise be static assets. While I'm a huge fan of both vuejs and angular, which offer directives, sometimes a website is still just a website, not an SPA or something that requires two-way binding and a controller. Ximp.js is about getting a lot of things done on the front end, fast.

It allows you to easily write how your javascript interacts with your HTML. Ximp.js takes care of the "<i>how</i>" you access your HTML, leaving you to focus entirely on the "<i>what</i>" of your functions in javascript.

I made it because I wanted to use the cool power of directives without the need for the data binding, models, or controllers. With ximp.js, there's no need for ANY setup besides dropping the file in your project and importing it using a script tag. You can immidately start using ximp's custom directives. Ximp.js is perfect for web projects that have constantly evolving requirements, huge forms with conditional flows, and online wizards. Ximp.js makes implementing these easy. When your primary source of data is embedded in the HTML/DOM itself, ximp.js is what you need.

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

`(T) n (T)`

Where `T` represents either a literal value OR is a token speicifying the id and attribute it is to watch (i.e. `id.attribute`, such as in the above example), this may be the id of ANY tag, and the attribute must be ANY attribute that tag has. `n` represents a "Connective". Connectives represent a combination of the typical relational and logical operators you would find in other langauges such as `==`, `!=`, `<`, `>`,`&&`, and `||`. Instead of these symboles, ximp.js uses the fortran style of `EQ` for equality, `NE` for non-equality, `LT` for less-than, `GT` for greater than and `AND`+`OR` appropriately (Because variety is the spice of life). The parenthesis are not optional.

In the cases where no relational connective (`EQ`,`NE`,`LT`,`GT`) is provided, it is assumed the value `true` is expected for success, and all others for failure.

ximp.js statments are ALWAYS read and evaluated from left-to-right, so `(one.value) EQ (two.value) AND (three.value)` will evaluate to check that `one.value == two.value`, and THEN make sure `three.value` evaluates to true (as it will have no connective). If instead it is written as `(two.value) AND (three.value) EQ (one.value)`, then it will instead check that `two.value` evaluates to true, and then check that `three.value` equals `one.value`.

<u>Examples of Correctly Formed statements</u>
<br/>
`(id.attribute) EQ (id.attribute)`<br/>
`(id.attribute) AND (id.attribute) GT (id.attribute)`<br/>
`(id.attribute) LT (id.attribute) AND (id.attribute)`<br/>
`(id.attribute) NE (id.attribute) AND (id.attribute) AND (id.attribute) EQ (id.attribute) OR (id.attribute)`<br/>
`(id.attribute)`<br/>
`(id.attribute) AND (id.attribute)`<br/>
<br/>
<u>Examples of Incorrectly Formed statements</u>
<br/>
`(id.attribute) EQ (id.attribute) EQ (id.attribute)`<br/>
`(id.attribute) (id.attribute)`<br/>
`(id.attribute) AND EQ (id.attribute)`<br/>
`(id.attribute) EQ (id.attribute) AND`<br/>
<br/>
Methods that are named in `ximp-action` or `ximp-action-failure` will always be passed the DOM object of the tag they are associated with.

You can use `ximp-foreach` in order to apply `ximp-action` to all children elements, using `ximp-foreach-init` will run the specified callback once before running `ximp-action` on child elements.

i.e. 

```
<ul ximp ximp-foreach ximp-foreach-init="initFunction" ximp-action="onEachChildFunction">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

You could include a `ximp-if` attribute in order to conditionally run the for-each (`ximp-foreach-init` will still run).

```
<ul ximp ximp-foreach ximp-if="(x.value)GT(y.value)" ximp-foreach-init="initFunction" ximp-action="onEachChildFunction">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```
