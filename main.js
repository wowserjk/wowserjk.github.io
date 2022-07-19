// Enables console logs.
let verbose = true;

// Counts the number of selections that the code detects per question.
let num_selections = 0;
while (1) {
    let e = document.getElementById('r' + (num_selections + 1))
    if (e === null) break
    ++num_selections
};
// Checks that quiz result ids are present. Outputs the amount of possible selections for each question to console.
if (num_selections === 0) window.alert('section ids are missing (r1, r2, etc.)');
if (verbose) console.log('num_selections = ' + num_selections);

// Counts the number of questions the code detects in total.
let num_questions = 0;
while (1) {
    let e = document.getElementsByName('q' + (num_questions + 1))
    if (e.length == 0) break
    ++num_questions
    if (e.length < 2) window.alert('q' + num_questions + ' has less than 2 answers.')
};
// Checks that questions are present. Also states the amount of questions in the quiz to console.
if (num_questions === 0) window.alert('No question names (q1, q2, q3, etc.');
if (verbose) console.log('num_questions = ' + num_questions);

// When always_show = false in weights.js, the following function hides results that are NOT the one the user received. When true, all results are shown regardless of quiz inputs.
function hide_selections() {
    if (!always_show) {
        // Tells console that hide_selections() is in effect.
        if (verbose) console.log('hide_selections()')
        document.getElementById('incomplete').style.display = 'none'
        for (let s = 1; s <= num_selections; ++s) {
            document.getElementById('r' + s).style.display = 'none'
        }
    }
};
hide_selections();

function select() {
    // Tells console that select is being used.
    if (verbose) console.log('select()')
    hide_selections()
    let incomplete = false
    let score = [num_selections]
    for (let s = 1; s <= num_selections; ++s) score[s - 1] = 0
    for (let q = 1; q <= num_questions; ++q) {
        let answers = document.getElementsByName('q' + q)
        let choice = false
        for (let a = 0; a < answers.length; ++a) {
            if (answers[a].checked) {
                choice = answers[a].value
                break
            }
        }
        // If choice is still false, tell the code that the quiz is incomplete.
        if (choice === false) {
            incomplete = true
            break
        }
        // Tells console what answer the user chose for each question e.g., q1: answer = a2
        if (verbose) console.log('q' + q + ': answer = ' + choice)

        let answer = choice.substring(1)
        for (let s = 1; s <= num_selections; ++s) {
            let w = weights[q - 1][answer - 1][s - 1]
            // Alerts the user if the weight of the user's selection could not be found.
            if (typeof w === 'undefined') window.alert('error: could not find weight for q' + q + 'a' + answer + 'r' + s)
            score[s - 1] += w
            // Displays the weights towards each possible result based on the user's selection.
            if (verbose) console.log('score[' + s + '] += ' + w)
        }
    }

    if (incomplete) {
        // Tells console that incomplete is true.
        if (verbose) console.log('incomplete')
        document.getElementById('incomplete').style.display = 'block'
    } else {
        // Unsure why maxscore is Number.MIN_VALUE. maxscore is used to hold the total weight values for each possible result.
        let maxscore = Number.MIN_VALUE
        // pick ends up being the value that determines what result is displayed to the user.
        let pick = 0
        for (let s = 1; s <= num_selections; ++s) {
            // Outputs the total score for each result to console.
            if (verbose) console.log('score[' + s + '] == ' + score[s - 1])
            if (score[s - 1] > maxscore) {
                pick = s
                maxscore = score[s - 1]
            }
        }
        // Outputs pick to console (the result with the highest maxscore).
        if (verbose) console.log('pick = r' + pick)
        // calls for the website to display what corresponds with 'r' + pick.
        document.getElementById('r' + pick).style.display = 'block'
    }
};