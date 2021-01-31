$.post('/getchallenge', data => {
    logStatus(data.statusText, data.color);

    let id = data.id;

    setTimeout(() => {
        solution = solveChallenge(data.challenge, data.timeout);
        if(solution.length === 0) {
            logStatus("Verification timed out!", "red");
        } else {
            $.post('/solution', {solution: solution, id: id}, data => {
                logStatus(data.statusText, data.color);
                
                $('.imageContainer').append(`<img src="${window.location.href + "userdata/" + data.token}"/>`);
            });  
        }
    }, 100);
});


function solveChallenge(challenge, timeout) {
    let solution;

    //Iterator which is used to find a matching sha256 string.
    let n = 0;
    var startTime = Date.now();

    while ((Date.now() - startTime) < timeout) {
        solution = getSha256(n.toString()).substring(0, challenge.length);

        if(solution === challenge) {
            return n.toString();
        }

        n++;
    }

    return "";
}

function getSha256(text) {
    return sha256(text).toUpperCase();
}

function logStatus(text, color) {
    $(".statusLog").append(`<p style="color: ${color}">${text}</p>`)
}

