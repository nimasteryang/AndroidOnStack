async function start() {
    var tag = "android"
    var newtag = document.getElementById("newtag").value;
    if (newtag != null){
        tag = newtag
    }
    var date_now = Date.now()
    var now = new Date()
    var data_week_ago = now.setHours(now.getHours() - 168)
    date_now = Math.floor(date_now / 1000)
    data_week_ago = Math.floor(data_week_ago / 1000)
    var result = await runAPI(1);
    console.log("top 10 request success:",result)
    var result2 = await runAPI(2);
    console.log("new 10 request success:",result2)
    async function runAPI(panel_id) {
        var request_str
        if (panel_id === 1) {
            request_str = 'https://api.stackexchange.com/2.2/questions?pagesize=10&fromdate=' + data_week_ago + '&todate=' + date_now + '&order=desc&sort=week&tagged='+tag+'&site=stackoverflow&key=L0dubq6MXQaAF3RiRkEdDQ(('
        } else {
            request_str = 'https://api.stackexchange.com/2.2/questions?pagesize=10&order=desc&sort=creation&tagged='+tag+'&site=stackoverflow&key=L0dubq6MXQaAF3RiRkEdDQ(('
        }
        //console.log(request_str)
        var testRequest = new Request(request_str)
        let json = await fetch(
            testRequest
        )
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`API problem: Error ${response.status}, ${response.statusText}`);
            });
        if(json === null){
            alert("API error")
        }
        var questions = json.items;
        console.log(questions)
        var answer
        for (i = 0; i < questions.length; i++) {
            title_index = i + 1
            title_id = "panel" + panel_id + "-title-" + title_index
            // console.log(title_id)
            document.getElementById(title_id).innerHTML = questions[i].title
            answer = await getAnswerByIDs(questions[i].question_id)
            // console.log(answer)
            element_id = "panel" + panel_id + "-element-" + title_index
            var elem2 = document.getElementById(element_id)
            var link_html = ""
            link_html += '<a href="'
            link_html += questions[i].link
            link_html += '"target="_blank"><H3>Go to origin post</H3></a>'
            console.log(link_html)
            if (answer === undefined) {
                elem2.innerHTML = link_html + "No Answer yet"
            } else {
                elem2.innerHTML = link_html + answer.body
            }
        }
        return true;
    }

    async function getAnswerByIDs(id) {
        var requestString = "https://api.stackexchange.com/2.2/questions/" + id + "/answers?pagesize=1&order=desc&sort=votes&site=stackoverflow&filter=!9_bDE(fI5"
        //console.log(requestString)
        let answer_json = await fetch(requestString).then(function (response) {
            if (response.ok) {
                return response.json();
                throw new Error(`API problem: Error ${response.status}, ${response.statusText}`);
            }
        })
        //console.log(answer_json)
        return answer_json.items[0];
    }
};