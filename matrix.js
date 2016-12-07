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
    var k, ratio;
    var pivot_row = 0;

    // find maybe easier way of determining pivot element
    for (i = 0; i < c-1; i++) {
        // look for min non-0 in this column - pivot
        if(pivot_row < r) { // r or r-1 ???
            var pivot_el = Math.abs(matrix[pivot_row][i]);
            var min_row = pivot_row;

            // if 1st element is 0
            if(pivot_el == 0) {
                for (k = pivot_row+1; k < r; k++) {
                    if(matrix[k][i] != 0) {
                        pivot_el = matrix[k][i];
                        min_row = k;
                        break;
                    }
                }
            }
            // now it is non-0 (if there was other non-0 element in column)
            for (k = pivot_row+1; k < r; k++) {
                if (Math.abs(matrix[k][i]) < pivot_el && matrix[k][i] != 0) {
                    pivot_el = Math.abs(matrix[k][i]);
                    min_row = k;
                }
            }

            // swap pivot row with current row, consider equality case
            if(pivot_row != min_row) {
                var tmp = matrix[min_row];
                matrix[min_row] = matrix[pivot_row];
                matrix[pivot_row] = tmp;
            }
            // can be done much better by ignoring 0's like this, check & do later
            // for (k = i; k < c; k++) {
            //     var temp = matrix[max_row][k];
            //     matrix[max_row][k] = matrix[i][k];
            //     matrix[i][k] = temp;
            // }


            // Upper Triangularisation
            if(matrix[pivot_row][i] == 0) {
                continue;
            }
            else {
                for (k = pivot_row+1; k < r; k++) {
                    ratio = matrix[k][i] / matrix[pivot_row][i];
                    for (j = i; j < c; j++)
                        matrix[k][j] -= ratio*matrix[pivot_row][j]; // can be done a bit better by making 1st el 0 directly
                }
                pivot_row++;
            }
        }
    }
    // checking rank to see consistency
    // try to do this by much more efficient way, maybe starting from end might be great
    var rank_augmented = r;
    for (i = 0; i < r; i++) {
        var found = false;
        for (j = 0; j < c; j++) {
            if (matrix[i][j] != 0) {
                found = true;
                break;
            }
        }
        if (!found)
            rank_augmented--;
    }

    var rank_coeff = r;
    for (i = 0; i < r; i++) {
        var found = false;
        for (j = 0; j < c-1; j++) {
            if (matrix[i][j] != 0) {
                found = true;
                break;
            }
        }
        if (!found)
            rank_coeff--;
    }

    var solution = true;
    if (rank_coeff != rank_augmented)
        solution = false;
    else {
        // Unique solution
        if (rank_augmented == c - 1) {
            // Back Substitution
            var result_matrix = new Array(c - 1);
            result_matrix[c - 2] = matrix[c - 2][c - 1] / matrix[c - 2][c - 2];
            for (i = c - 3; i >= 0; i--) {
                var sum = 0;
                for (j = i + 1; j < c - 1; j++) {
                    sum += matrix[i][j] * result_matrix[j];
                }
                result_matrix[i] = (matrix[i][c - 1] - sum) / matrix[i][i];
            }
        }
        else {
            // Infinite solution
            var infinite = true;
            // finding free variables has some problems - not working properly
            var no_free_var = c-1 - rank_augmented; // number of free(independent) variables
            var free_var = new Array();
            var row = 0;
            //var col = 0;
            for(i = 0; i < c-1 && row < r; i++) {
                if (matrix[row][i] == 0) {
                    free_var.push(i+1);
                }
                else
                    row++;
            }
            if(free_var.length != no_free_var) {
                for(i = rank_augmented; i < c-1; i++){
                    free_var.push(i+1);
                }
            }
        }
    }

    // printing result
    if(!solution) {
        var text = document.createElement("p");
        text.name = "result";
        text.innerHTML = "<i>System is inconsistent - no solution exists</i>";
        document.body.appendChild(text);
    }
    else {
        if(!infinite) {
            for (i = 0; i < c-1; i++)
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
        else {
            var text = document.createElement("p");
            text.name = "result";
            text.innerHTML = "<i>System has infinite solution</i>";
            document.body.appendChild(text);
            for(i = 0; i < free_var.length; i++) {
                var text = document.createElement("p");
                text.name = "result";
                //text.innerHTML = "<i>System has infinite solution</i>";
                text.innerHTML = "X" + free_var[i] + " is free variable <br>";
                document.body.appendChild(text);
            }
        }
    }
}

function saythat() {
    alert("This is coming soon");
}
