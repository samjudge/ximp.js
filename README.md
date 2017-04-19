# ximp.js
Ximp.js (eXplicitly IMPerative) is a small tool used to implement logical control in your HTML tags through ximp's custom attributes. It is specifically targetted for newer developers so I can get them into bad habits early (jk).

Using ximp.js means you don't need the boilerplate you would normally need to use in javascript in order to implement logical control, or when using javascript to add dynamic control over your page would be impractical, or when you would use ajax to update what would otherwise be static assets.

I made it because I wanted to use the cool power of directives without the need for the data binding, models, or controllers that are included with the heavyweight angular, or even the lightweight vue. There's no need for ANY setup besides dropping the file in your project. It began when I inherited a huge HTML form with hundreds of inputs (and constatnly changing requirements). One constant in the requirements, however, was that the page's inputs followed a branching structure (i.e. if user selects x in input a then show input b). Ximp.js makes implementing this easy. This resulted in my javascript being majority boilerplate for essentailly cantrip logic.

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

Where `T` represents either a literal value OR is a token speicifying the id and attribute it is to watch (i.e. `id.attribute`, such as in the above example). `n` represents a "Connective". Connectives represent a combination of the typical relational and logical operators you would find in other langauges such as `==`, `!=`, `<`, `>`,`&&`, and `||`. Instead of these symboles, ximp.js uses the fortran style of `EQ` for equality, `NE` for non-equality, `LT` for less-than, `GT` for greater than and `AND`+`OR` appropriately (Because variety is the spice of life). The parenthesis are not optional.

In the cases where no connective is provided, it is assumed the value `true` is expected for success, and all others for failure.

ximp.js statments are ALWAYS read and evaluated from left-to-right, so `(one.value) EQ (two.value) AND (three.value)` will evaluate to check that `one.value == two.value`, and THEN make sure `three.value` evaluates to true (as it will have no connective). If instead it is written as `(two.value) AND (three.value) EQ (one.value)`, then it will instead check that `two.value` evaluates to true, and then check that `three.value` equals `one.value`.

Methods that are named in `ximp-action` or `ximp-action-failure` will always be passed the DOM object of the tag they are associated with.
