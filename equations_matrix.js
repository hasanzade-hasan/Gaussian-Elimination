/**
 * Created by Hasan on 04/11/2016.
 */
//=====================================================================================================================
/** @Expression class for storing the free variables and other ones depending on them
 * constructor takes list(array) of variables and corresponding list(array) of coefficients
 * has 4 general operations as methods: add(), sub(), mul(), div()
 * and show() method to display the expression itself
 */
{
    function Expression(coeff, variable) {
        // coeff and variable are both arrays of the same size
        this.coeff = coeff;
        this.variable = variable;
        this.show = show;
        this.add = addExp;
        this.sub = subExp;
        this.mul = mulExp;
        this.div = divExp;
    }

    function show() {
        var result = "";
        for (var i = 0; i < this.variable.length; i++) {
            if (this.coeff[i] > 0) {
                if (i === 0) {
                    if (this.coeff[i] == 1)
                        result += this.variable[i];
                    else
                        result += this.coeff[i] + this.variable[i];
                }
                else {
                    if (this.coeff[i] == 1)
                        result += "+" + this.variable[i];
                    else
                        result += "+" + this.coeff[i] + this.variable[i];
                }
            }
            else if (this.coeff[i] < 0) {
                if (this.coeff[i] == -1)
                    result += "-" + this.variable[i];
                else
                    result += this.coeff[i] + this.variable[i];
            }
        }
        return result;
    }

    function addExp(n) {
        var newVar = this.variable.slice();
        var newCoeff = this.coeff.slice();
        for (var i = 0; i < n.variable.length; i++) {
            if (this.variable.indexOf(n.variable[i]) > -1) {
                newCoeff[this.variable.indexOf(n.variable[i])] =
                    this.coeff[this.variable.indexOf(n.variable[i])] + n.coeff[i];
            }
            else {
                newVar.push(n.variable[i]);
                newCoeff.push(n.coeff[i]);
            }
        }
        return new Expression(newCoeff, newVar);
    }

// subtraction is a bit different
    function subExp(n) {
        var newVar = this.variable.slice();
        var newCoeff = this.coeff.slice();
        for (var i = 0; i < n.variable.length; i++) {
            if (this.variable.indexOf(n.variable[i]) > -1) {
                newCoeff[this.variable.indexOf(n.variable[i])] =
                    this.coeff[this.variable.indexOf(n.variable[i])] - n.coeff[i];
            }
            else {
                newVar.push(n.variable[i]);
                newCoeff.push(-1 * n.coeff[i]);
            }
        }
        return new Expression(newCoeff, newVar);
    }

// we will need multiplication with numbers only
    function mulExp(n) {
        var newVar = this.variable.slice();
        var newCoeff = this.coeff.slice();
        for (var i = 0; i < this.variable.length; i++) {
            newCoeff[i] *= n;
            newCoeff[i] = Math.round(newCoeff[i]*1e10)/1e10;
        }

        return new Expression(newCoeff, newVar);
    }

// division is similar to multiplication
    function divExp(n) {
        var newVar = this.variable.slice();
        var newCoeff = this.coeff.slice();
        for (var i = 0; i < this.variable.length; i++) {
            newCoeff[i] /= n;
            newCoeff[i] = Math.round(newCoeff[i]*1e10)/1e10;
        }

        return new Expression(newCoeff, newVar);
    }
}
//=====================================================================================================================
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
    var div = document.createElement("div");
    div.id = "div-matrix";
    document.body.appendChild(div);

    // removing already loaded ones
    var node = document.getElementById("div-matrix");
    var result_matrix = document.getElementById("result_matrix");
    var div_result = document.getElementById("div-result");
    var steps_backup = document.getElementById("steps_div");
    var steps = document.getElementById("new_steps_div");

    if(node.hasChildNodes()) {
        document.body.replaceChild(div, node);
        if(result_matrix != null) document.body.removeChild(result_matrix);
        if(div_result != null) document.body.removeChild(div_result);
        if(steps != null) document.body.removeChild(steps);
        if(steps_backup != null) document.body.removeChild(steps_backup);
    }

    // creating form for matrix
    var form = document.createElement("form");
    form.id = "matrix";
    div.appendChild(form);

    // creating free matrix entries
    var i, j;
    for (i=0; i<row; i++)
    {
        for (j=0; j<col; j++)
        {
            var element = document.createElement("input");
            element.name = "entry";
            element.type = "text";
            element.className = "entries";
            form.appendChild(element);
        }

        // new line after each row
        var para = document.createElement("p");
        form.appendChild(para);
    }

    // adding button for auto generate matrix
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "fill";
    btn.value = "Example";
    btn.id = "fill";
    btn.onclick = function(){fill(row,col)};
    form.appendChild(btn);

    // adding button to calculate matrix
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "calculate";
    btn.value = "Solve";
    btn.id = "calculate";
    btn.onclick = calculate_matrix;
    form.appendChild(btn);

    window.location = "equations.html#pmatrix";
}
//=====================================================================================================================
function calculate_matrix() {
    var para = document.createElement("p");
    para.id = "result_matrix";
    document.body.appendChild(para);
    document.getElementById("result_matrix").innerHTML = "<hr> Solution:";

    var r = parseInt(document.getElementById("size").elements[0].value);
    var c = parseInt(document.getElementById("size").elements[1].value);
    var i, j;
    var matrix = new Array(r);
    for(i = 0; i < r; i++)
        matrix[i] = new Array(c);

    // getting matrix entries
    var entries = document.getElementsByName("entry");
    var next = 0;
    for(i = 0; i < r; i++) {
        for (j = 0; j < c; j++) {
            matrix[i][j] = parseFloat(entries.item(next).value);
            next++;
        }
    }

    var div = document.createElement("div");
    div.id = "steps_div";
    div.style.display = "none";
    document.body.appendChild(div);

    // now matrix is the real matrix that need some changes on it
    var k, ratio;
    var pivot_row = 0;
    var counter = 0;
    // find maybe easier way of determining pivot element
    for (i = 0; i < c-1; i++) {
        // look for non-0 in this column - pivot
        if(pivot_row < r) { // r - number of rows
            var pivot_el = Math.abs(matrix[pivot_row][i]);
            var min_row = pivot_row;

            // if 1st element is 0
            if (pivot_el == 0) {
                for (k = pivot_row + 1; k < r; k++) {
                    if (matrix[k][i] != 0) {
                        pivot_el = matrix[k][i];
                        min_row = k;
                        break;
                    }
                }
            }

            // swap pivot row with current row, consider equality case
            if (pivot_row != min_row) {
                var tmp = matrix[min_row];
                matrix[min_row] = matrix[pivot_row];
                matrix[pivot_row] = tmp;
            }

            // Upper Triangularisation
            if (matrix[pivot_row][i] != 0) {
                for (k = pivot_row + 1; k < r; k++) {
                    var start_of_row = matrix[k][i]; // my heuristics
                    for (j = i; j < c; j++) {
                        matrix[k][j] = matrix[k][j] * matrix[pivot_row][i] - start_of_row * matrix[pivot_row][j]; // my heuristics
                        matrix[k][j] = Math.round(matrix[k][j] * 1e10) / 1e10; // rounding
                    }
                }
                pivot_row++;
            }

            //// now it is non-0 (if there was other non-0 element in column)
            //for (k = pivot_row + 1; k < r; k++) {
            //    if (Math.abs(matrix[k][i]) < pivot_el && matrix[k][i] != 0) {
            //        pivot_el = Math.abs(matrix[k][i]);
            //        min_row = k;
            //    }
            //}

            //ratio = matrix[k][i] / matrix[pivot_row][i];
            //matrix[k][j] -= ratio * matrix[pivot_row][j]; // can be done a bit better by making 1st el 0 directly

            // can be done much better by ignoring 0's like this, check & do later
            // for (k = i; k < c; k++) {
            //     var temp = matrix[max_row][k];
            //     matrix[max_row][k] = matrix[i][k];
            //     matrix[i][k] = temp;
            // }

            // showing solution steps
            var para = document.createElement("p");
            para.id = "steps" + counter;
            var temp = matrix + "";
            if(document.getElementById("steps" + (counter-1)) == null){
                para.innerHTML = matrix + "";
                div.appendChild(para);
            }
            else{
                if(document.getElementById("steps" + (counter-1)).innerText !== temp) {
                    para.innerHTML = matrix + "";
                    div.appendChild(para);
                }
            }
            counter++;
        }
    }
    // checking rank to see consistency
    // r - number of rows, c - number of columns
    var rank_augmented = r;          // at the start assume rank is same as r
    for (i = 0; i < r; i++) {        // for each row
        var found = false;           // assume not seen a non-zero value so far
        for (j = c-1; j >= 0; j--) { // for each entry of matrix starting from end
            if (matrix[i][j] != 0) { // if non-zero value found
                found = true;        // we are done
                break;               // so, quit looking for the others
            }
        }
        if (!found)                  // if there is not any non-zero value
            rank_augmented--;        // means all 0's, so 0 row found, decrement r
    }

    var rank_coeff = r;
    for (i = 0; i < r; i++) {
        found = false;
        for (j = c-2; j >= 0; j--) {
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
            // rounding required
            result_matrix[c-2] = Math.round(result_matrix[c-2]*1e10)/1e10;
            for (i = c - 3; i >= 0; i--) {
                var sum = 0;
                for (j = i + 1; j < c - 1; j++) {
                    sum += matrix[i][j] * result_matrix[j];
                }
                result_matrix[i] = (matrix[i][c - 1] - sum) / matrix[i][i];
                // rounding required
                result_matrix[i] = Math.round(result_matrix[i]*1e10)/1e10;
            }
        }
        else {
            // Infinite solution
            var infinite = true;
            //var no_free_var = c-1 - rank_augmented; // number of free(independent) variables

            // Back Substitution
            result_matrix = new Array(c - 1);
            //result_matrix[c - 2] = matrix[c - 2][c - 1] / matrix[c - 2][c - 2];

            var row = rank_augmented-1;
            // for the last variable i = c-2;
            // i = c-2;
            var flag = false; // means no free variable
            for(j = c-3; j >= 0; j--) {
                if(matrix[row][j] != 0){
                    flag = true;
                    break;
                }
            }
            if(flag) { // this is free variable
                result_matrix[c-2] = new Expression([1], ['X' + (c-1)]); //better if can display number in index of X
            }
            else { // not a free variable
                result_matrix[c-2] = new Expression([matrix[row][c-1]/matrix[row][c-2]], ['']);
                row--;
            }

            //for (i = c - 3; i >= 0; i--) {
            //    var sum = 0;
            //    for (j = i + 1; j < c - 1; j++) {
            //        sum += matrix[i][j] * result_matrix[j];
            //    }
            //    result_matrix[i] = (matrix[i][c - 1] - sum) / matrix[i][i];
            //}
            for(i = c-3; i >= 0; i--) {
                flag = false;
                for(j = i-1; j >= 0; j--) {
                    if(matrix[row][j] != 0){
                        flag = true;
                        break;
                    }
                }
                if(flag) { // this is free variable
                    result_matrix[i] = new Expression([1], ['X' + (i+1)]);
                }
                else { // not a free variable
                    var sum = new Expression([0], ['']);
                    for(k = i+1; k < c-1; k++) {
                        sum = sum.add(result_matrix[k].mul(matrix[row][k]));
                    }
                    var temp1 = new Expression([matrix[row][c-1]], ['']);
                    result_matrix[i] = (temp1.sub(sum)).div(matrix[row][i]);
                    row--;
                }
            }
        }
    }

    // printing result
    var div = document.createElement("div");
    div.id = "div-result";
    document.body.appendChild(div);

    var div_result = document.getElementById("div-result");
    if(div_result.hasChildNodes()) {
        document.body.replaceChild(div, div_result);
    }

    if(!solution) {
        var text = document.createElement("p");
        text.name = "result";
        text.className = "result";
        text.innerHTML = "<i>System is inconsistent - no solution exists</i>";
        div.appendChild(text);

        var btn = document.createElement("input");
        btn.id = "show_solution";
        btn.name = "show_solution";
        btn.type = "button";
        btn.value = "Why?";
        btn.onclick = function(){steps(r, c)};
        div.appendChild(btn);
    }
    else {
        if(!infinite) {
            for (i = 0; i < c-1; i++)
            {
                var text = document.createElement("input");
                text.readOnly = true;
                text.name = "result";
                text.className = "result";
                text.value = result_matrix[i];
                div.appendChild(text);

                para = document.createElement("p");
                div.appendChild(para);
            }

            var btn = document.createElement("input");
            btn.id = "show_solution";
            btn.name = "show_solution";
            btn.type = "button";
            btn.value = "Show solution steps";
            btn.onclick = function(){steps(r, c)};
            div.appendChild(btn);
        }
        else {
            for (i = 0; i < c-1; i++)
            {
                var text = document.createElement("input");
                text.readOnly = true;
                text.name = "result";
                text.className = "result";
                text.value = result_matrix[i].show();
                div.appendChild(text);

                para = document.createElement("p");
                div.appendChild(para);
            }
            var p = document.createElement("p");
            p.name = "infinite";
            p.className = "result";
            p.innerHTML = "<i>System has infinite solutions. Some variables are</i> <br> <i>dependent on others, which are free variables</i>";
            div.appendChild(p);

            var btn = document.createElement("input");
            btn.id = "show_solution";
            btn.name = "show_solution";
            btn.type = "button";
            btn.value = "Show solution steps";
            btn.onclick = function(){steps(r, c)};
            div.appendChild(btn);
        }
    }
    window.location = "equations.html#div-result";
}
//=====================================================================================================================
function steps(r, c){

    // that'd be great if can implement here also removing already loaded ones

    var div = document.getElementById("steps_div");
    var newDiv = document.createElement("div");
    newDiv.id = "new_steps_div";
    newDiv.style.display = "block";
    newDiv.style.textAlign = "center";
    newDiv.innerHTML = div.innerHTML;
    document.body.appendChild(newDiv);

    var children = newDiv.childNodes;
    for(var k = 0; k < children.length; k++) {
        var str = children[k].innerHTML;
        var entries = str.split(',');
        var para = document.createElement("p");

        for(var i = 0; i < r; i++) {
            for(var j = 0; j < c; j++) {
                var el = document.createElement("input");
                el.name = "entry";
                el.type = "text";
                el.readOnly = true;
                el.className = "steps_entries";
                el.setAttribute("value", entries[i*c + j]+"");
                para.appendChild(el);
            }
            // new line after each row
            var br = document.createElement("br");
            para.appendChild(br);
        }
        children[k].innerHTML = para.innerHTML;
    }
    document.body.removeChild(div);

    window.location = "equations.html#new_steps_div";
}
//=====================================================================================================================
function fill(row, col) {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            var entries = document.getElementsByName("entry");
            entries.item(i*(col) + j).value = Math.round(Math.random()*100);
        }
    }
}
