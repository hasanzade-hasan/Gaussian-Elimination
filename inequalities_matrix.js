/**
 * Created by Hasan on 05/02/2017.
 */
// method for filling fields with values
function fill(row, col) {
    var coeff, sign;
    if(row == 4 && col == 3) {
        coeff = [[2, -3, 1, 10], [-2, -3, 2, 4], [-3, 1, 3, 14], [3, 1, 0, 5]];
        sign = ["great", "lessEqual", "less", "greatEqual"];
    }
    else if(row == 3 && col == 3) {
        coeff = [[1, 1, 1, 3], [2, 2, 1, 4], [1, -1, 0, 1]];
        sign = ["lessEqual", "lessEqual", "lessEqual"];
    }
    else if(row == 5 && col == 2) {
        coeff = [[2, -4, 3], [-1, 1, 4], [1, 0, 5], [1, 0, 9], [1, 1, 3]];
        sign = ["greatEqual", "lessEqual", "great", "great", "great"];
    }

    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col + 1; j++) {
            var entries = document.getElementsByName("entry");
            entries.item(i * (col + 1) + j).value = coeff[i][j];
        }

        var selects = document.getElementsByName("sign_select");
        selects.item(i).value = sign[i];
    }
}
// allows us to enter system entries and signs for each inequality
function generate_matrix() {
    // getting the row and column numbers
    var row = parseInt(document.getElementById("size").elements[1].value);
    var col = parseInt(document.getElementById("size").elements[0].value);

    // instructions for matrix
    var p = document.createElement("p");
    p.id = "pmatrix";
    document.body.appendChild(p);
    document.getElementById("pmatrix").innerHTML = "<hr> Enter matrix entries:";

    // creating form for matrix
    var form = document.createElement("form");
    form.id = "matrix";

    // creating free matrix entries
    var i, j;
    for (i=0; i<row; i++)
    {
        for (j=0; j<col; j++)
        {
            var element = document.createElement("input");
            element.size = "5";
            element.name = "entry";
            element.type = "text";
            form.appendChild(element);
        }

        // create select menu for sign of inequalities
        var select = document.createElement("select");
        select.id = "sign_select";
        select.name = "sign_select";

        var option0 = document.createElement("option");
        option0.value = "default";
        var t0 = document.createTextNode("sign");
        option0.appendChild(t0);
        select.appendChild(option0);

        var option1 = document.createElement("option");
        option1.value = "great";
        var t1 = document.createTextNode("\x3E");
        option1.appendChild(t1);
        select.appendChild(option1);

        var option2 = document.createElement("option");
        option2.value = "less";
        var t2 = document.createTextNode("\x3C");
        option2.appendChild(t2);
        select.appendChild(option2);

        var option3 = document.createElement("option");
        option3.value = "greatEqual";
        var t3 = document.createTextNode("\u2265");
        option3.appendChild(t3);
        select.appendChild(option3);

        var option4 = document.createElement("option");
        option4.value = "lessEqual";
        var t4 = document.createTextNode("\u2264");
        option4.appendChild(t4);
        select.appendChild(option4);

        form.appendChild(select);

        element = document.createElement("input");
        element.size = "5";
        element.name = "entry";
        element.type = "text";
        form.appendChild(element);

        // new line after each row
        var para = document.createElement("p");
        form.appendChild(para);
    }

    // button for filling fields automatically
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "fill";
    btn.value = "Fill fields with example";
    btn.onclick = function() {fill(row, col)};
    form.appendChild(btn);

    //var text = document.createElement("input");
    //text.type = "text";
    //text.name = "ex no";
    //text.size = "5";
    //form.appendChild(text);

    //para = document.createElement("p");
    //form.appendChild(para);

    // adding button to calculate matrix
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "analyse";
    btn.value = "Analyse system";
    btn.onclick = analyse;
    form.appendChild(btn);

    document.body.appendChild(form);
}
// changing matrix to standard form which is like Ax<b or Ax<=b
function standardize(matrix, signs) {
    var r = matrix.length;
    var c = matrix[0].length;
    for (var i = 0; i < r; i++) {
        if(signs[i] == "great") {
            for(var j = 0; j < c; j++) {
                matrix[i][j] *= -1;
            }
            signs[i] = "less";
        }
        else if(signs[i] == "greatEqual") {
            for(j = 0; j < c; j++) {
                matrix[i][j] *= -1;
            }
            signs[i] = "lessEqual";
        }
    }
}
// displays system of linear inequalities as it should be - containing also variables X_i
function display(matrix, signs) {
    var r = matrix.length;
    var c = matrix[0].length;
    var str = "";
    for(var i = 0; i < r; i++) {
        for (var j = 0; j < c-1; j++) {
            if(matrix[i][j] > 0) {
                if(j == 0) {
                    if(matrix[i][j] == 1)
                        str += "X" + (j+1);
                    else
                        str += matrix[i][j] + "X" + (j+1);
                }
                else {
                    if(matrix[i][j] == 1)
                        str += "+X" + (j+1);
                    else
                        str += "+" + matrix[i][j] + "X" + (j+1);
                }
            }
            else if(matrix[i][j] < 0) {
                if(matrix[i][j] == -1)
                    str += "-X" + (j+1);
                else
                    str += matrix[i][j] + "X" + (j+1);
            }
        }
        switch (signs[i]) {
            case "great":
                str += " \x3E ";
                break;
            case "less":
                str += " \x3C ";
                break;
            case "greatEqual":
                str += " \u2265 ";
                break;
            case "lessEqual":
                str += " \u2264 ";
                break;
        }
        str += matrix[i][c-1] + "<br />";
    }

    return str;
}
// allows us to read all system entries and signs of each inequality
function analyse() {
    var r = parseInt(document.getElementById("size").elements[1].value);
    var c = parseInt(document.getElementById("size").elements[0].value);
    var i, j;
    var matrix = new Array(r);
    for (i = 0; i < r; i++)
        matrix[i] = new Array(c + 1);

    // getting matrix entries - matrix[][]
    var entries = document.getElementsByName("entry");
    var counter = 0;
    for (i = 0; i < r; i++) {
        for (j = 0; j < c + 1; j++) {
            matrix[i][j] = parseFloat(entries.item(counter).value);
            counter++;
        }
    }

    // getting sign of each inequality - signs[]
    var selects = document.getElementsByName("sign_select");
    var signs = new Array(r);
    for (i = 0; i < r; i++) {
        var sign = selects.item(i);
        signs[i] = sign.options[sign.selectedIndex].value;
    }
    //alert(display(matrix, signs));
    var para = document.createElement("p");
    para.id = "initial_system";
    document.body.appendChild(para);
    document.getElementById("initial_system").innerHTML = "<hr> System is: " + "<br />" + display(matrix, signs);

    //convert matrix into standard form
    standardize(matrix, signs);

    para = document.createElement("p");
    para.id = "standard";
    document.body.appendChild(para);
    document.getElementById("standard").innerHTML = "<hr> System in standard form is: " + "<br />" + display(matrix, signs);

    // get list of eliminable and non-eliminable variables
    var eliminable = [];
    var nonEliminable = [];
    //var nonEliminable = new Array(); // do I really need that? or just one list is enough?
    for (j = 0; j < c; j++) {
        if (matrix[0][j] < 0) {
            for (i = 1; i < r; i++) {
                if (matrix[i][j] > 0) {
                    eliminable.push(j);
                    break;
                }
            }
        }
        else if (matrix[0][j] > 0) {
            for (i = 1; i < r; i++) {
                if (matrix[i][j] < 0) {
                    eliminable.push(j);
                    break;
                }
            }
        }
    }

    // print eliminable and non-eliminable variables
    var strEl = "";
    var strNonEl = "";
    for(i = 0; i < c; i++) {
        if(eliminable.indexOf(i) > -1)
            strEl += "X" + (i + 1) + ", ";
        else {
            strNonEl += "X" + (i + 1) + ", ";
            nonEliminable.push(i);
        }
    }
    var nonEl = document.createElement("p");
    nonEl.id = "nonEl";
    document.body.appendChild(nonEl);
    document.getElementById("nonEl").innerHTML = "Non-Eliminable variables are: {" + strNonEl.substr(0, strNonEl.length-2) + "}";
    var el = document.createElement("p");
    el.id = "el";
    document.body.appendChild(el);
    document.getElementById("el").innerHTML = "Eliminable variables are: {" + strEl.substr(0, strEl.length-2) + "}";

    var order = document.createElement("p");
    order.id = "order";
    document.body.appendChild(order);
    document.getElementById("order").innerHTML = "<hr> List variables by id in order to be evaluated. " +
        "By definition non-eliminable variables must be evaluated before eliminable varibales <br/>";

    var orderNonEl = document.createElement("p");
    orderNonEl.id = "orderNonEl";
    document.body.appendChild(orderNonEl);
    document.getElementById("orderNonEl").innerHTML = "Order of non-eliminable variables: ";
    for(i = 0; i < nonEliminable.length; i++) {
        element = document.createElement("input");
        element.size = "5";
        element.name = "NonElOrder";
        element.type = "text";
        document.body.appendChild(element);
    }
    var orderEl = document.createElement("p");
    orderEl.id = "orderEl";
    document.body.appendChild(orderEl);
    document.getElementById("orderEl").innerHTML = "Order of eliminable variables: ";
    for(i = 0; i < eliminable.length; i++) {
        var element = document.createElement("input");
        element.size = "5";
        element.name = "elOrder";
        element.type = "text";
        document.body.appendChild(element);
    }

    para = document.createElement("p");
    document.body.appendChild(para);

    // adding button to start evaluation
    var button = document.createElement("input");
    button.type = "button";
    button.name = "evaluate";
    button.value = "Start evaluation";
    button.onclick = function() {evaluate(matrix, signs, eliminable, nonEliminable)};
    document.body.appendChild(button);
}
// matrix multiplication
function multiply(a, b) {
    var aRow = a.length, aCol = a[0].length, bCols = b[0].length;
    var m = [];
    for (var r = 0; r < aRow; r++) {
        m[r] = [];
        for (var c = 0; c < bCols; c++) {
            m[r][c] = 0;
            for (var i = 0; i < aCol; i++) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}
// creates the system specific non-negative sparse matrix each time for eliminating variable
function eliminateVariable(matrix, signs, eliminationVar) {
    var r = matrix.length;

    // matrix consists of 3 sub-matrices with respect to each variable
    var posMatrix = [];
    var negMatrix = [];
    var zeroMatrix = [];

    // consider signs also !!!
    var posSigns = [];
    var negSigns = [];
    var zeroSigns = [];

    for(var i = 0; i < r; i++) {
        if(matrix[i][eliminationVar] > 0) {
            posMatrix.push(matrix[i]);
            posSigns.push(signs[i]);
        }
        else if(matrix[i][eliminationVar] < 0) {
            negMatrix.push(matrix[i]);
            negSigns.push(signs[i]);
        }
        else {
            zeroMatrix.push(matrix[i]);
            zeroSigns.push(signs[i]);
        }
    }

    var mulMatrix = [];
    var mulSigns = [];

    for(i = 0; i < posMatrix.length; i++) {
        for (var j = 0; j < negMatrix.length; j++) {
            var row = new Array(r);
            row.fill(0);
            row[i] = -1 * negMatrix[j][eliminationVar];
            row[j+posMatrix.length] = posMatrix[i][eliminationVar];
            mulMatrix.push(row);

            if(posSigns[i] == "lessEqual" && negSigns[j] == "lessEqual")
                mulSigns.push("lessEqual");
            else
                mulSigns.push("less");
        }
    }

    for(i = 0; i < zeroMatrix.length; i++) {
        // consider 0's here and push to mulMatrix
        row = new Array(r);
        row.fill(0);
        // this is to avoid altering other inequalities which current variable does not exist
        row[posMatrix.length + negMatrix.length + i] = 1; // keep them same
        mulMatrix.push(row);
        mulSigns.push(zeroSigns[i]);
    }

    // since I created my mulMatrix according to pos neg and zero, I need to change my matrix for that too
    var newMatrix = [];
    for (i = 0; i < posMatrix.length; i++)
        newMatrix.push(posMatrix[i]);
    for (i = 0; i < negMatrix.length; i++)
        newMatrix.push(negMatrix[i]);
    for (i = 0; i < zeroMatrix.length; i++)
        newMatrix.push(zeroMatrix[i]);

    return [multiply(mulMatrix, newMatrix), mulSigns];
}
// evaluates to find ranges for variables
function evaluateVariable(matrix, signs, evaluationVar) {
    var r = matrix.length;
    var c = matrix[0].length;

    var result = [];
    var resultSigns = [];
    for(var i = 0; i < r; i++) {
        var flag = true; // means all zeros
        for(var j = 0; j < c-1; j++) {
            if(j != evaluationVar) {
                if(matrix[i][j] != 0) {
                    flag = false;
                    break;
                }
            }
        }
        if(flag) {
            if(matrix[i][evaluationVar] < 0) {
                if(signs[i] == "less")
                    var sign = "great";
                else if(signs[i] == "lessEqual")
                    var sign = "greatEqual";
                else if(signs[i] == "great") // probably no need for this and below, but in any case
                    var sign = "less";
                else if(signs[i] == "greatEqual")
                    var sign = "lessEqual";

                result.push(matrix[i][c-1] / matrix[i][evaluationVar]);
                resultSigns.push(sign);
            }
            else if(matrix[i][evaluationVar] > 0) {
                var sign = signs[i];
                result.push(matrix[i][c-1] / matrix[i][evaluationVar]);
                resultSigns.push(sign);
            }
        }
    }
    // identify upper and lower bounds
    var upperBounds = [];
    var lowerBounds = [];
    for(i = 0; i < result.length; i++) {
        if(resultSigns[i] == "less" || resultSigns[i] == "lessEqual")
            upperBounds.push(result[i]);
        else
            lowerBounds.push(result[i]);
    }

    // finally find range
    var up = Math.min(...upperBounds);
    var low = Math.max(...lowerBounds);

    // correct this !!!
    // if there are many extreme points below sign arrat will give me only first of them, so this might be false x1 >= 5, x1 > 5 => x1 >= 5
    return [up, resultSigns[result.indexOf(up)], low, resultSigns[result.indexOf(low)]];
}

function evaluate(matrix, signs, eliminable, nonEliminable){
    var orderEl = [];
    var elements = document.getElementsByName("elOrder");
    for(var i = 0; i < eliminable.length; i++) {
        orderEl.push(elements.item(i).value);
    }
    var orderNonEl = [];
    elements = document.getElementsByName("NonElOrder");
    for(i = 0; i < nonEliminable.length; i++) {
        orderNonEl.push(elements.item(i).value);
    }

    var p = document.createElement("p");
    p.id = "evaluationResult";
    document.body.appendChild(p);
    document.getElementById("evaluationResult").innerHTML = "<hr>";

    var arrayOfMatrices = [];
    var arrayOfSigns = [];

    // now need to deal with the non-eliminable variables and provide range for all variables
    evaluateNext(orderNonEl, orderEl, matrix, signs, arrayOfMatrices, arrayOfSigns, function(){
        var p = document.createElement("p");
        p.id = "final";
        document.body.appendChild(p);

        var str = "Following values as you choose satisfies the given system of inequalities: {";
        var values = document.getElementsByName("valueForVar");
        for(i = 0; i < matrix[0].length - 1; i++) {
            var val = document.getElementById(i + "");
            //var val = values.item(i);
            str += val.value + ", ";
        }
        document.getElementById("final").innerHTML = str.substr(0, str.length-2) + "}";
    });  // evaluates and substitutes all but one non-eliminable variables
}

function evaluateNext(orderNonEl, orderEl, matrix, signs, arrayOfMatrices, arrayOfSigns, callback) {
    if(orderNonEl.length > 0) {
        if(orderNonEl.length == 1) {
            // what if there are all eliminabel variables?
            // means matrix has at least one non-eliminable variable

            var cloneMatrix = matrix.slice();
            var cloneSigns = signs.slice();

            // elimination order is reverse of evaluation order for eliminable variables
            for(var i = orderEl.length-1; i >= 0; i--) {
                var eliminationVar = orderEl[i] - 1;
                var result = eliminateVariable(matrix, signs, eliminationVar);
                matrix = result[0].slice();
                signs = result[1].slice();
                arrayOfMatrices.push(matrix.slice());
                arrayOfSigns.push(signs.slice());
            }
        }

        var evaluationVar = orderNonEl.shift() - 1; // shift removes 1st element and returns new list
        var leftStr = "";
        var rightStr = "";
        var range = evaluateVariable(matrix, signs, evaluationVar).slice();
        if(range[1] == "less" || range[1] == "lessEqual") {
            rightStr += range[1] + " " + range[0];
        }
        else
            rightStr += "less Infinity";
        if(range[3] == "great") {
            leftStr += range[2] + " " + "less";
        }
        else if(range[3] == "greatEqual") {
            leftStr += range[2] + " " + "lessEqual";
        }
        else
            leftStr += "-Infinity less ";

        var str = leftStr + " X" + (evaluationVar+1) + " " + rightStr;
        var p = document.createElement("p");
        p.id = "evaluationVar" + evaluationVar;
        document.body.appendChild(p);
        document.getElementById("evaluationVar" + evaluationVar).innerHTML = "Choose value for X" + (evaluationVar+1) + " within range: " + str;
        var t = document.createElement("input");
        t.type = "text";
        t.size = "5";
        t.name = "valueForVar";
        t.id = "" + evaluationVar;
        document.body.appendChild(t);

        var btn = document.createElement("input");
        btn.type = "button";
        btn.name = "next";
        btn.value = "next";
        btn.onclick = function(){
            if(orderNonEl.length == 0) {
                matrix = cloneMatrix;
                signs = cloneSigns;
            }

            // consider value in previous text field and change matrix respectively
            var v = document.getElementsByName("valueForVar");
            var val = v.item(v.length - 1).value;
            matrix = substitute(evaluationVar, val, matrix);
            //document.matrix = matrix.slice();
            evaluateNext(orderNonEl, orderEl, matrix, signs, arrayOfMatrices, arrayOfSigns, callback);
        };
        document.body.appendChild(btn);
    }
    else if(orderEl.length > 0){
        if(orderEl.length == 1) {
            var myMatrix = matrix;
            var mySigns = signs;
        }
        else {
            arrayOfMatrices.pop();
            arrayOfSigns.pop();

            var myMatrix = arrayOfMatrices.pop();
            var mySigns = arrayOfSigns.pop();

            var values = document.getElementsByName("valueForVar");
            for(i = 0; i < values.length; i++) {
                var val = values.item(i);
                myMatrix = substitute(val.id, val.value, myMatrix);
            }
        }

        var evaluationVar = orderEl.shift() - 1;
        var leftStr = "";
        var rightStr = "";
        var range = evaluateVariable(myMatrix, mySigns, evaluationVar);
        if(range[1] == "less" || range[1] == "lessEqual") {
            rightStr += range[1] + " " + range[0];
        }
        else
            rightStr += "less Infinity";
        if(range[3] == "great") {
            leftStr += range[2] + " " + "less";
        }
        else if(range[3] == "greatEqual") {
            leftStr += range[2] + " " + "lessEqual";
        }
        else
            leftStr += "-Infinity less ";

        var str = leftStr + " X" + (evaluationVar+1) + " " + rightStr;
        var p = document.createElement("p");
        p.id = "evaluationVar" + evaluationVar;
        document.body.appendChild(p);
        document.getElementById("evaluationVar" + evaluationVar).innerHTML = "Choose value for X" + (evaluationVar+1) + " within range: " + str;
        var t = document.createElement("input");
        t.type = "text";
        t.size = "5";
        t.name = "valueForVar";
        t.id = "" + evaluationVar;
        document.body.appendChild(t);

        var btn = document.createElement("input");
        btn.type = "button";
        btn.name = "next";
        btn.value = "next";
        btn.onclick = function(){
            // consider value in previous text field and change matrix respectively
            var v = document.getElementsByName("valueForVar");
            var val = v.item(v.length - 1).value;
            matrix = substitute(evaluationVar, val, matrix);
            evaluateNext(orderNonEl, orderEl, matrix, signs, arrayOfMatrices, arrayOfSigns, callback);
        };
        document.body.appendChild(btn);
    }
    else callback();
}

function substitute(evaluationVar, val, matrix) {
    var r = matrix.length;
    var c = matrix[0].length;

    for (var i = 0; i < r; i++) {
        matrix[i][c-1] -= matrix[i][evaluationVar]*val;
        matrix[i][evaluationVar] = 0;
    }

    return matrix;
}

