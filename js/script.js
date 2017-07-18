$(document).ready(wrapper);

function wrapper() {

  //css for buttons; does not take care of background colors
  $("#row-1").children().css({
    "width": "16.31%",
    "position": "relative",
    "left": "3.9%"
  });

  for (var i = 2; i < 7; i++) {
    $("#row-" + i).children().css({
      "width": "21%",
      "height": "50px",
      "font-size": "28px",
      "position": "relative",
      "left": "3.9%",
      "top": 20 * (i - 1) + "px"
    });
  }

  //equal button is double wide, so it needs special css
  $("#btn-eq").css({
    "width": "45.9%",
    "height": "50px",
    "font-size": "28px",
    "position": "relative",
    "left": "3.9%",
    "top": "100px"
  });

  //get needed math symbols for buttons
  $("#btn-sqrt").html("&radic;");
  $("#btn-div").html("&#247;")
  $("#btn-times").html("&#215;");
  $("#btn-minus").html("&mdash;");

  //variable for memory; start with nothing in memory
  var memory = "";

  //clear entry button click function; resets display only
  $("#btn-ce").click(function() {
    $("#display-text").html("0");
  });

  //all clear button click function; resets display and memory
  $("#btn-ac").click(function() {
    $("#display-text").html("0");
    memory = "";
  });

  //number button click functions
  for (let i = 0; i < 10; i++) {
    $("#btn-" + i).click(function() {
      if ($("#display-text").html() === "0") {
        $("#display-text").html(i);
      } else {
        $("#display-text").html($("#display-text").html() + i);
      }
    });
  }

  //str variable simplifies functions below
  var str = "";

  //decimal button click function
  $("#btn-dec").click(function() {
    str = $("#display-text").html();
    if (!str[str.length - 1].match(/\./))
      $("#display-text").html($("#display-text").html() + ".");
  });

  //arithmetic ops button click functions
  $("#btn-plus").click(function() { //addition
    str = $("#display-text").html();
    if (!str[str.length - 1].match(/\+|\/|\xD7|\u2014|\-/))
      $("#display-text").html($("#display-text").html() + "+");
  });

  $("#btn-minus").click(function() { //subtraction
    str = $("#display-text").html();
    if (!str[str.length - 1].match(/\+|\/|\xD7|\u2014|\-/))
      $("#display-text").html($("#display-text").html() + "&mdash;");
  });

  $("#btn-times").click(function() { //multiplication
    //don't allow user to multiply if the display is in default state or right after another operation key is pressed
    str = $("#display-text").html();
    if (str !== "0" && !str[str.length - 1].match(/\+|\/|\xD7|\u2014|\-/)) {
      $("#display-text").html($("#display-text").html() + "&#215;");
    }
  });

  $("#btn-div").click(function() { //division
    //don't allow user to divide if the display is in default state or right after another operation key is pressed
    str = $("#display-text").html();
    if (str !== "0" && !str[str.length - 1].match(/\+|\/|\xD7|\u2014|\-/)) {
      $("#display-text").html($("#display-text").html() + "/");
    }
  });

  $("#btn-neg").click(function() { //negative
    str = $("#display-text").html();
    //don't allow negative signs right after numbers, or two negative signs in a row
    if (str !== "0" && !str[str.length - 1].match(/[1-9]|\-/)) {
      $("#display-text").html($("#display-text").html() + "-");
    }
    //if display is in default state, replace the 0 with the negative sign; ie display reads "-", not "0-"
    else if (str === "0") {
      $("#display-text").html("-");
    }

    //return display to default state when the user presses "-" twice in a row from the default state
    else if (str[str.length - 1] === "-" && str !== "-") {
      $("#display-text").html(str.slice(0, -1));
    } else if (str[str.length - 1] === "-") {
      $("#display-text").html("0");
    }
  });

  //square root
  $("#btn-sqrt").click(function() {
    if (parseFloat(calculate($("#display-text").html())) >= 0) {
      $("#display-text").html(+parseFloat(Math.sqrt(parseFloat(calculate($("#display-text").html())))).toFixed(8));
    } else alert("Since this is just a basic calculator, I opted not to allow for imaginary numbers!");
  });

  $("#btn-percent").click(function() {
    if ($("#display-text").html() !== "0") {
      $("#display-text").html(+parseFloat(parseFloat(calculate($("#display-text").html())) / 100));
    }
  });

  //equal button click function
  $("#btn-eq").click(function() {
    $("#display-text").html(calculate($("#display-text").html()));
  });

  //M+ button click function
  $("#btn-mp").click(function() {
    memory = calculate($("#display-text").html());
  });

  //M- button click function
  $("#btn-mm").click(function() {
    memory = "";
  });

  //RCM button click function
  $("#btn-rcm").click(function() {
    str = $("#display-text").html();
    if (memory !== "" && (str[str.length - 1].match(/\+|\/|\xD7|\u2014|\-/) || str === "0")) {
      if ($("#display-text").html() !== "0") {
        $("#display-text").html($("#display-text").html() + memory);
      } else $("#display-text").html(memory);
    }
  });

  function calculate(exp) {
    //space out the expression so that it //can be split using spaces
    exp = exp.replace(/\u2014/g, " &mdash; ").replace(/\+/g, " + ").replace(/\xD7/g, " &#215; ").replace(/\//g, " / ");

    //if last char is space (ie last entered char is an operator), remove this space. If last space is negative sign, add a space
    //this allows the function to detect syntax errors where the last entered char is an operator
    if (exp[exp.length - 1].match(/ |\-/)) {
      if (exp[exp.length - 1] === " ") {
        exp = exp.slice(0, -1);
      }

      if (exp[exp.length - 1].match(/\-/)) {
        exp = exp.replace(exp[exp.length - 1], " " + exp[exp.length - 1]);
      }
    }

    var expArr = exp.split(' ');

    if (expArr[expArr.length - 1].match(/\+|\/|\xD7|\u2014|\-/)) {
      alert("Syntax Error: Must enter a number after the operator " + expArr[expArr.length - 1] + "!");
      return "SYNTAX ERROR";
    } else {

      for (var index = 0; index < expArr.length; index++) {
        if (expArr[index] == "/" && expArr[index + 1] === "0") {
          alert("Syntax Error: Division by zero");
          return "SYNTAX ERROR";
        }
      }
      //set up variables for upcoming loops
      var i = 0;
      var len = expArr.length;

      //first, search for multiplication and division - in no particular order! Order of operations will work!
      while (i < len) {
        if (expArr[i] === "/" || expArr[i] === "&#215;") {
          //if division is found, remove the division sign and the two numbers surrounding it; replace with the quotient of the two numbers
          //length is decreased by two in this operation
          if (expArr[i] === "/") {
            expArr.splice(i - 1, 3, parseFloat(expArr[i - 1]) / parseFloat(expArr[i + 1]));
            len -= 2;
          }

          //if mult. is found, remove the mult. sign and the two numbers surrounding it; replace with the product of the two numbers
          //length is decreased by two in this operation
          if (expArr[i] === "&#215;") {
            expArr.splice(i - 1, 3, parseFloat(expArr[i - 1]) * parseFloat(expArr[i + 1]));
            len -= 2;
          }
        }

        //if neither operation is found, continue iterating
        else i++;
      }
      //reset the index
      i = 0;

      //search for addition and subtraction, in no particular order
      //second loop is necessary so that mult/div take priority over add/sub
      while (i < len) {
        if (expArr[i] === "+" || expArr[i] === "&mdash;") {
          //if subtraction is found, replace the minus sign and the numbers surrounding it with the difference of the numbers
          //length is decreased by two in this operation
          if (expArr[i] === "+") {
            expArr.splice(i - 1, 3, parseFloat(expArr[i - 1]) + parseFloat(expArr[i + 1]));
            len -= 2;
          }
          //if addition is found, replace the plus sign and the numbers surrounding it with the sum of the numbers
          //length is decreased by two in this operation
          if (expArr[i] === "&mdash;") {
            expArr.splice(i - 1, 3, parseFloat(expArr[i - 1]) - parseFloat(expArr[i + 1]));
          }
        }

        //if neither operation is found, continue iterating
        else i++;
      }

      //round result to at most 8 decimal places; will not round if not necessary
      return +parseFloat(expArr[0]).toFixed(8);
    }
  }
}
