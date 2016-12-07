<script type="text/javascript" src="matrix.js" ></script>

<?php
/**
 * Created by PhpStorm.
 * User: Hasan
 * Date: 30/11/2016
 * Time: 13:40
 */
    // pay attention to input.txt file, no extra lines !
    $lines = array();

    // get input file
    $datafile = fopen($_POST['data'], "r");
    // write lines to array until end-of-file
    while(!feof($datafile)) {
        $lines[] = fgets($datafile);
    }
    fclose($datafile);

    // find row number
    $row = sizeof($lines) - 1;

    // get each number separated by space
    $matrix = array();
    for($i = 0; $i < $row; $i++){
        $matrix[$i] = explode(" ", $lines[$i]);
    }
    // find column number
    $col = sizeof($matrix[0]);

    // now matrix is ready to be processed - 2D array

    $pivot_row = 0;
    for ($i = 0; $i < $col-1; $i++) {
        // look for min non-0 in this column - pivot
        if($pivot_row < $row) {
            $pivot_el = abs($matrix[$pivot_row][$i]);
            $min_row = $pivot_row;

            // if 1st element is 0
            if($pivot_el == 0) {
                for ($k = $pivot_row+1; $k < $row; $k++) {
                    if($matrix[$k][$i] != 0) {
                        $pivot_el = $matrix[$k][$i];
                        $min_row = $k;
                        break;
                    }
                }
            }
            // now it is non-0 (if there was other non-0 element in column)
            for ($k = $pivot_row+1; $k < $row; $k++) {
                if (abs($matrix[$k][$i]) < $pivot_el && $matrix[$k][$i] != 0) {
                    $pivot_el = abs($matrix[$k][$i]);
                    $min_row = $k;
                }
            }

            // swap pivot row with current row, consider equality case
            if($pivot_row != $min_row) {
                $tmp = $matrix[$min_row];
                $matrix[$min_row] = $matrix[$pivot_row];
                $matrix[$pivot_row] = $tmp;
            }
            // can be done much better by ignoring 0's like this, check & do later
            // for ($k = $i; $k < $col; $k++) {
            //     $temp = $matrix[$max_row][$k];
            //     $matrix[$max_row][$k] = $matrix[$i][$k];
            //     $matrix[$i][$k] = $temp;
            // }


            // Upper Triangularisation
            if($matrix[$pivot_row][$i] == 0) {
                continue;
            }
            else {
                for ($k = $pivot_row+1; $k < $row; $k++) {
                    $ratio = $matrix[$k][$i] / $matrix[$pivot_row][$i];
                    for ($j = $i; $j < $col; $j++)
                        $matrix[$k][$j] -= $ratio*$matrix[$pivot_row][$j]; // can be done a bit better by making 1st el 0 directly
                }
                $pivot_row++;
            }
        }
    }
    // checking rank to see consistency

    // try to do this by much more efficient way, maybe starting from end might be great
    $rank_augmented = $row;
    for ($i = 0; $i < $row; $i++) {
        $found = false;
        for ($j = 0; $j < $col; $j++) {
            if ($matrix[$i][$j] != 0) {
                $found = true;
                break;
            }
        }
        if (!$found)
            $rank_augmented--;
    }

    $rank_coeff = $row;
    for ($i = 0; $i < $row; $i++) {
        $found = false;
        for ($j = 0; $j < $col-1; $j++) {
            if ($matrix[$i][$j] != 0) {
                $found = true;
                break;
            }
        }
        if (!$found)
            $rank_coeff--;
    }

    $solution = true;
    $infinite = false;
    if ($rank_coeff != $rank_augmented)
        $solution = false;
    else {
        // Unique solution
        if ($rank_augmented == $col - 1) {
            // Back Substitution
            $result_matrix = array(); // size is $col-1
            $result_matrix[$col - 2] = $matrix[$col - 2][$col - 1] / $matrix[$col - 2][$col - 2];
            for ($i = $col - 3; $i >= 0; $i--) {
                $sum = 0;
                for ($j = $i + 1; $j < $col - 1; $j++) {
                    $sum += $matrix[$i][$j] * $result_matrix[$j];
                }
                $result_matrix[$i] = ($matrix[$i][$col - 1] - $sum) / $matrix[$i][$i];
            }
        }
        else {
            // Infinite solution
            $infinite = true;
        }
    }

    // printing result
    if(!$solution)
        echo "<i>System is inconsistent - no solution exists</i>";
    else {
        if($infinite)
            echo "<i>System has infinite solutions</i>";
        else {
            echo "Result: <br>";
            for($i = 0; $i < $col-1; $i++) {
                echo "<input type='text' readonly value='$result_matrix[$i]'/> <br>";
            }
            echo "<input type='button' value='Show solution' onclick='saythat()' />";
        }
    }

// print matrix
//    for ($i = 0; $i < $row; $i++) {
//        for ($j = 0; $j < $col; $j++) {
//            echo "<input type='text' readonly value='" . $matrix[$i][$j] . "' />";
//        }
//        echo "<br>";
//    }
?>