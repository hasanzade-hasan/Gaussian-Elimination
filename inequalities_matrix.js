/**
 * Created by Hasan on 05/02/2017.
 */
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

        var element = document.createElement("input");
        element.size = "5";
        element.name = "entry";
        element.type = "text";
        form.appendChild(element);

        // new line after each row
        var para = document.createElement("p");
        form.appendChild(para);
    }

    // adding button to calculate matrix
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "evaluate";
    btn.value = "Evaluate";
    btn.onclick = evaluate;
    form.appendChild(btn);

    document.body.appendChild(form);
}

// allows us to read all system entries and signs of each inequality
function evaluate(){
    var para = document.createElement("p");
    para.id = "initial_system";
    document.body.appendChild(para);
    document.getElementById("initial_system").innerHTML = "<hr> Your system is: ";

    var r = parseInt(document.getElementById("size").elements[1].value);
    var c = parseInt(document.getElementById("size").elements[0].value);
    var i, j;
    var matrix = new Array(r);
    for(i = 0; i < r; i++)
        matrix[i] = new Array(c+1);

    // getting matrix entries - matrix[][]
    var entries = document.getElementsByName("entry");
    var counter = 0;
    for(i = 0; i < r; i++) {
        for (j = 0; j < c+1; j++) {
            matrix[i][j] = parseFloat(entries.item(counter).value);
            counter++;
        }
    }

    // getting sign of each inequality - signs[]
    var selects = document.getElementsByName("sign_select");
    var signs = new Array(r);
    for(i = 0; i < r; i++) {
        var sign = selects.item(i);
        signs[i] = sign.options[sign.selectedIndex].value;
    }
}

function al(){
    alert("soon");
}