/*! quiz-game 2014-12-03 15:11:48 */
function Quiz(a) {
    this.qData = a.qData, this.stat = {
        total: a.qData.length,
        hp: 0,
        passed: 0,
        num: 0,
        question: "",
        score: 0,
        options: [],
        answers: [],
        selected: [],
        answered: !1,
        ended: !1
    }, this.stat.hp = 0 === a.totalScore ? a.qData.reduce(function(a, b) {
        return a + b.score
    }, 0) : a.totalScore
}
Quiz.prototype = {
    _orderNum: function(a, b) {
        return a - b
    },
    next: function() {
        var a = 0;
        if (this.stat.num < this.stat.total) {
        	this.stat.num++;
        	if (1 === this.stat.num) {
        		this.stat.ended = !1;
        	};
        	a = this.stat.num - 1;
        	this.stat.question = this.qData[a].question;
        	this.stat.options = this.qData[a].options;
        	this.stat.answers = this.qData[a].answers;
        	this.stat.score = this.qData[a].score;
        };
    },
    submitAnswer: function(a) {
        var b = null;
        return a && this.inputAnswer(a), this.stat.ended || (this.stat.answers.sort(this._orderNum).toString() === this.stat.selected.sort(this._orderNum).toString() ? (this.stat.passed++, b = !0) : (this.stat.hp -= this.stat.score, b = !1), this.stat.answered = !0, (this.stat.hp <= 0 || this.stat.num >= this.stat.total) && (this.stat.ended = !0)), b
    },
    inputAnswer: function(a) {
        var b = this;
        this.stat.selected = [], a.length && a.forEach(function(a) {
            -1 === b.stat.selected.indexOf(+a) && b.stat.selected.push(+a)
        })
    },
    removeAnswer: function(a) {
        var b = this,
            c = -1;
        a ? a.length && a.forEach(function(a) {
            c = b.stat.selected.indexOf(+a), -1 !== c && b.stat.selected.splice(c, 1)
        }) : this.stat.selected = []
    }
}, $(function() {
    "use strict";

    function updateViewQItem(qItemView, quiz) {
        var c = "";
        qItemView.quesNode.text(quiz.question);
        qItemView.hpNode.text(quiz.hp);
        c = quiz.options.reduce(function(previousValue, currentValue, index) {
            return previousValue + '<li><span class="mark">' + String.fromCharCode(65 + index) + '</span><span class="opt">' + currentValue + "</span></li>"
        }, "");
        qItemView.optNode.html(c)
    }

    function bindSelectAction(optionNode) {
        optionNode.on("click", "li", function() {
        	if (quiz) {
        		quiz.submitAnswer([$(this).index()]);
        		quiz.stat.ended === !0 ? (optionNode.empty(), result()) : (quiz.next(), updateViewQItem(qItemIDs, quiz.stat))
        	};
            return !1
        })
    }

    function result() {
        function updateResult(a) {
            $("#J-container").html(a);
            var b = $("#J-result"),
                c = $("#J-comment");
            if (quiz.stat.num <=3) {
            	b.html('弱爆了，你答对了<span class="right-num">' + quiz.stat.passed + "/" + quiz.stat.total + "</span>题，<br>首席书记官说：");
            	c.html("<span>在叁伍柒 <em>白白占位</em></span><br>「我不知道，我什么都不知道~」");
            };
            if (quiz.stat.num <= 6) {
            	b.html('太 Low 了，你答对了<span class="right-num">' + quiz.stat.passed + "/" + quiz.stat.total + "</span>题，<br>首席书记官说：");
            	c.html("<span>在叁伍柒 <em>跟不上</em>聊天的节奏吧</span><br>「等会儿再看，先匿了...」");
            };
            if (quiz.stat.num <= 9) {
            	b.html('还需继续加油，你答对了<span class="right-num">' + quiz.stat.passed + "/" + quiz.stat.total + "</span>题，<br>首席书记官说：");
            	c.html("<span>在叁伍柒 <em>常常</em>扯淡逗逼吧</span><br>「其实…我就是个逗逼！」");
            };
            if (10 === quiz.stat.num && quiz.stat.hp < 90) {
            	b.html('干的不错，你答对了<span class="right-num">' + quiz.stat.passed + "/" + quiz.stat.total + "</span>题，<br>首席书记官说：");
            	c.html("<span><em>叁伍柒是你的避风港</em></span><br>「有事没事就泡着~」");
            };
            if (10 === quiz.stat.num && 90 === quiz.stat.hp) {
            	b.html('棒极了，你答对了<span class="right-num">' + quiz.stat.passed + "/" + quiz.stat.total + "</span>题，<br>首席书记官说：");
            	c.html("<span><em>叁伍柒里的话题都是你吧？</em></span><br>「不过瘾啊不过瘾」");
            };
            if (10 === quiz.stat.num && 90 === quiz.stat.hp) {
            	$(".btn-box").addClass("hide")
            }else{
            	 $(".full-score").addClass("hide");
            	 /MicroMessenger/i.test(navigator.userAgent) || $(".share-img").addClass("hide");
            	 $("#J-restart").on("click", function() {
            	 	newGame()
                });
            };
        }
        updateResult(resultTemplate ? resultTemplate : getRemoteData("tpl/1412/result.html", "resultPageHTML"))
    }

    function newGame() {
        function newQuiz(c) {
            quiz = new Quiz(JSON.parse(c));
            quiz.next()
            qItemIDs = {
                quesNode: $("#J-qu"),
                hpNode: $("#J-hp"),
                optNode: $("#J-opt")
            };
            updateViewQItem(qItemIDs, quiz.stat);
            bindSelectAction(qItemIDs.optNode);
        }
        $("#J-container").html(qItemTemplate ? qItemTemplate : getRemoteData("tpl/1412/game.html", "gamePageHTML")), newQuiz(quizDataJSON ? quizDataJSON : getRemoteData("json/question-data-1412.json", "quizDataStr"))
    }

    function getRemoteData(requestURL, localKey) {
        var returnData = "";
        return window.sessionStorage && sessionStorage[localKey] ? sessionStorage[localKey] : ($.ajax({
            type: "GET",
            url: appURL + requestURL,
            data: {
                t: timeStamp
            },
            dataType: "text",
            async: !1,
            success: function(responseDate) {
                window.sessionStorage && (sessionStorage[localKey] = responseDate), returnData = responseDate
            }
        }), returnData)
    }
    var appURL = "http://357-quiz.avosapps.com/",
        timeStamp = "1417775442251",
        quiz = null,
        qItemIDs = null,
        qItemTemplate = "",
        resultTemplate = "",
        quizDataJSON = "";
        qItemTemplate = getRemoteData("questionItem.html", "gamePageHTML"), 
        quizDataJSON = getRemoteData("json/20141205.json", "quizDataStr"),
        resultTemplate = getRemoteData("result.html", "resultPageHTML"),
        $("#J-startGame").on("click", function() {
        newGame()
    }).addClass("loaded"), WeixinApi.ready(function(a) {
        var b = {
                async: !0,
                ready: function() {
                    var a = {
                        appId: "",
                        imgUrl: "http://357-quiz.avosapps.com/images/share-logo.png?t=1417775442251",
                        link: "http://357-quiz.avosapps.com/",
                        desc: "@看丁丁日报",
                        title: $("title").text()
                    };
                    quiz && quiz.stat.ended === !0 && (a.desc = "首席书记官说，我对叁伍柒的了解为：" + $("#J-comment em").text()), this.dataLoaded(a)
                },
                fail: function() {
                    alert("分享失败，请稍候再试。")
                },
                confirm: function() {
                    
                }
            },
            c = {
                async: !0,
                ready: function() {
                    var a = {
                        appId: "",
                        imgUrl: "http://357-quiz.avosapps.com/images/share-logo.png?t=1417775442251",
                        link: "http://357-quiz.avosapps.com/",
                        desc: $("title").text(),
                        title: $("title").text()
                    };
                    quiz && quiz.stat.ended === !0 && (a.desc = "首席书记官说，我对叁伍柒的了解为：" + $("#J-comment em").text()), this.dataLoaded(a)
                },
                fail: function() {
                    alert("分享失败，请稍候再试。")
                },
                confirm: function() {
                    
                }
            };
        a.shareToFriend({}, b), a.shareToTimeline({}, c)
    })
});