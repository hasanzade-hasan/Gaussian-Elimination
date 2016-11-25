/**
 * Created by Hasan on 04/11/2016.
 */

function generate_matrix() {
    // getting the row and column numbers
    var row = parseInt(document.getElementById("size").elements[0].value);
    var col = parseInt(document.getElementById("size").elements[1].value);


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

        // new line after each row
        var para = document.createElement("p");
        form.appendChild(para);
    }

    // adding button to calculate matrix
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "calculate";
    btn.value = "Calculate";
    btn.onclick = calculate_matrix;
    form.appendChild(btn);

    document.body.appendChild(form);

    // var para = document.createElement("p");
    // para.id = "show";
    // document.body.appendChild(para);
}

function calculate_matrix() {
    var para = document.createElement("p");
    para.id = "result_matrix";
    document.body.appendChild(para);
    document.getElementById("result_matrix").innerHTML = "<hr> Result:";

    var r = parseInt(document.getElementById("size").elements[0].value);
    var c = parseInt(document.getElementById("size").elements[1].value);
    var i, j;
    var matrix = new Array(r);
    for(i = 0; i < r; i++)
        matrix[i] = new Array(c);

    // getting matrix entries
    var entries = document.getElementsByName("entry");
    var counter = 0;
    for(i = 0; i < r; i++) {
        for (j = 0; j < c; j++) {
            matrix[i][j] = parseFloat(entries.item(counter).value);
            counter++;
        }
    }

    // now matrix is the real matrix that need some changes on it
    var k, u, n;
    n = r;

    // Upper Triangularisation
    for(k=0; k<n-1; k++) {
        for (i = k + 1; i < n; i++) {
            u = matrix[i][k] / matrix[k][k];
            for (j = k; j<=n; j++)
                matrix[i][j] = matrix[i][j] - u*matrix[k][j];
        }
    }
    // Back Substiution
    var result_matrix = new Array(n);
    result_matrix[n-1] = matrix[n-1][n] / matrix[n-1][n-1];
    for (i = n-2; i>=0; i--) {
        var sum = 0;
        for (j = i+1; j<n; j++) {
            sum = sum + matrix[i][j]*result_matrix[j];
            result_matrix[i] = (matrix[i][n] - sum) / matrix[i][i];
        }
    }

    for (i = 0; i < n; i++)
    {
        var text = document.createElement("input");
        text.readOnly = true;
        text.name = "result";
        text.size = "5";
        text.value = result_matrix[i];
        document.body.appendChild(text);

        para = document.createElement("p");
        document.body.appendChild(para);
    }

    var btn = document.createElement("input");
    btn.id = "show_solution";
    btn.name = "show_solution";
    btn.type = "button";
    btn.value = "Show solution";
    btn.onclick = saythat;
    document.body.appendChild(btn);
}

function saythat() {
    alert("This is coming soon");
}
