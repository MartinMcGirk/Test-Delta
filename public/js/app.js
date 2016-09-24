var app = angular.module('app', ['ui.router',
    'AuthenticationService',
    'UserService',
    'ui.ace',
    'timer',
    'angular-sortable-view',
    'rzModule']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);


app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('TokenInterceptor');

    $stateProvider
        .state('home', {
            url:'/',
            templateUrl: 'views/home.html',
            controller: 'MainController',
            access: {
                requireLogin: false
            }
        })
        .state('pricing', {
            url:'/pricing',
            templateUrl: 'views/pricing.html',
            controller: 'MainController',
            access: {
                requireLogin: false
            }
        })
        .state('demoTest', {
            url:'/DemoTest',
            templateUrl: 'views/DemoTest.html',
            controller: 'DemoTestController',
            access: {
                requireLogin: false
            }
        })
        .state('createTest', {
            url:'/CreateTest',
            templateUrl: 'views/CreateTest.html',
            controller: 'CreateTestController',
            access: {
                requireLogin: true
            }
        })
        .state('testSetup', {
            url: '/TestSetup/:testId',
            templateUrl: 'views/TestSetup.html',
            controller: 'TestSetupController',
            access: {
                requireLogin: true
            }
        })
        .state('myTests', {
            url: '/MyTests',
            templateUrl: 'views/MyTests.html',
            controller: 'MyTestsController',
            access: {
                requireLogin: true
            }
        })
        .state('takeTest', {
            url:'/TakeTest/:candidateId',
            templateUrl: 'views/TakeTest.html',
            controller: 'TakeTestController',
            access: {
                requireLogin: false
            }
        })
        .state('login', {
            url:'/Login',
            templateUrl: 'views/login.html',
            controller: 'loginController',
            access: {
                requireLogin: false
            }
        })
        .state('register', {
            url:'/Register',
            templateUrl: 'views/register.html',
            controller: 'registerController',
            access: {
                requireLogin: false
            }
        })
        .state('myCandidates', {
            url:'/MyCandidates',
            templateUrl: 'views/MyCandidates.html',
            controller: 'MyCandidatesController',
            access: {
                requireLogin: true
            }
        })
        .state('createCandidate', {
            url:'/CreateCandidate',
            templateUrl: 'views/CreateCandidate.html',
            controller: 'CreateCandidateController',
            access: {
                requireLogin: true
            }
        })
}]);

app.run(function($rootScope, $window, $state, AuthenticationFactory) {
    // when the page refreshes, check if the user is already logged in
    AuthenticationFactory.check();

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams) {
        if ((toState.access && toState.access.requireLogin) && !AuthenticationFactory.isLogged) {
            event.preventDefault();
            $state.go("login");
        } else {
            //debugger;
            // check if user object exists else fetch it. This is incase of a page refresh
            if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
            if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
        }
    });
});

app.controller('loginController', function($scope, $window, $state, UserAuthFactory, AuthenticationFactory) {
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.login = function() {
            var username = $scope.user.username,
                password = $scope.user.password;

            if (username !== undefined && password !== undefined) {
                UserAuthFactory.login(username, password).success(function(data) {
                    AuthenticationFactory.isLogged = true;
                    AuthenticationFactory.user = data.user.username;
                    AuthenticationFactory.userRole = data.user.role;
                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.username; // to fetch the user details on refresh
                    $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh
                    $state.go("myTests");

                }).error(function(status) {
                    $scope.error = true;
                    $scope.errorMessage = status.message;
                });
            } else {
                alert('Invalid credentials');
            }
        };

        $scope.register = function () {
            $state.go('register');
        }
    }
);

app.controller('logoutController', function ($scope, $state, UserAuthFactory, AuthenticationFactory) {
    $scope.logout = function () {
        UserAuthFactory.logout();
    }
});

app.controller('registerController', function ($scope, $state, UserAuthFactory) {

    $scope.register = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call register from service
        UserAuthFactory.register($scope.user.username, $scope.user.password)
            // handle success
            .then(function () {
                $state.go('login');
                $scope.disabled = false;
                $scope.registerForm = {};
            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                $scope.registerForm = {};
            });
    };

    $scope.login = function () {
        $state.go('login');
    }
});

app.controller('MainController', function($scope) {

});

app.controller('CreateTestController', function($scope, $http, $location, $state, testFactory) {

    $scope.applyTest = function(){
        var newTestData = {
            test: {
                test_name: $scope.testName,
                time_limit: $scope.timeLimit,
                test_instructions: $scope.instructions
            }
        }

        testFactory.createTest(newTestData).
            then(function(response) {
                // this callback will be called asynchronously
                // when the response is available
                var testId = response.data.testId;
                $state.go('testSetup', { testId: testId });
            }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("There was an error creating this test. Please try again later.");
            });
    }

});

app.controller('DemoTestController', function($scope, $http) {

    $http.get('../../DemoData/DemoTest.json').success(function(data) {
        $scope.test_data = data.test;
    });
});

app.controller('MyTestsController', function($scope, $http, $state, testFactory) {

    $scope.test_data = [];

    testFactory.getTests()
        .then(function(data){
            $scope.test_data = data.data;
        })

    $scope.deleteTest = function(testId) {
        testFactory.deleteTest(testId)
            .success(function() {
                testFactory.getTests()
                    .then(function (data) {
                        $scope.test_data = data.data;
                    })
            });
    }

    $scope.addNewTest = function(){
        $state.go('createTest');
    }
});

app.controller('MyCandidatesController', function($scope, $http, $state, candidateFactory, testFactory) {
    $scope.test_data = [];

    candidateFactory.getCandidates()
        .then(function(data){
            $scope.test_data = data.data;
        })

    testFactory.getTests()
        .then(function(data){
            $scope.allTests = data.data;
        });

    $scope.getQuestionsWithoutSections = function(candidate){
        return candidate.candidate.test.questions.filter(function(x){return x.question_type != "section"});
    }

    $scope.changeSlider = function(question, sliderValue){
        var recordLength = question.answer_record.length;
        if(recordLength > 0 && recordLength > sliderValue){
            if(question.question_type === "freeform"){
                question.candidate_answer = question.answer_record[sliderValue].answer_text;
            } else if (question.question_type === "code") {
                question.filler_code = question.answer_record[sliderValue].answer_text;
            }

        }
    }

    $scope.actionsForCandidate = function(candidate){
        $scope.candidate = angular.copy(candidate);
        var modal = $('#candidateModal');
        modal.modal('show');
    }

    $scope.deleteCandidateDialog = function(candidate){
        $scope.candidate = candidate;
        var modal = $('#deleteModal');
        modal.modal('show');
    }

    $scope.deleteCandidate = function(candidateId) {
        candidateFactory.deleteCandidate(candidateId)
            .success(function() {
                candidateFactory.getCandidates()
                    .then(function (data) {
                        $scope.test_data = data.data;
                        var modal = $('#deleteModal');
                        modal.modal('hide');
                    })
            });
    }

    $scope.getCandidateScore = function(candidate){
        var potentialPoints = 0;
        var actualPoints = 0;
        candidate.candidate.test.questions.forEach(function(question){
            potentialPoints += question.points_available;
            if(question.question_type === 'mcq'){
                var mark = $scope.markMcqQuestion(question);
                actualPoints += mark.points_scored;
            } else if (question.question_type === 'freeform') {
                var mark = $scope.markFreeFormQuestion(question);
                actualPoints += mark.points_scored;
            } else if (question.question_type === 'code') {

            }
        })
        return "( " + actualPoints + " / " + potentialPoints + " )";
    }

    $scope.markQuestion = function(question){
        if(question.question_type === 'mcq'){
            return $scope.markMcqQuestion(question);
        } else if (question.question_type === 'freeform') {
            return $scope.markFreeFormQuestion(question);
        } else if (question.question_type === 'code') {

        }
    }

    $scope.markMcqQuestion = function(question){
        var questionAnalysis = {
            points_available: question.points_available,
            points_scored: 0,
            points_summary: function(){
                return this.points_scored + " / " + this.points_available;
            },
            status: "",
            message: ""
        }

        var answersArray = [];
        for(var i = 0; i < question.possible_answers.length; i++) {
            var pa = question.possible_answers[i];
            if((pa.chosen == pa.correct) || (pa.chosen == null && pa.correct == false)){
                answersArray[i] = true;
            } else {
                answersArray[i] = false;
            }
        }
        if(answersArray.indexOf(false) == -1){
            questionAnalysis.points_scored = question.points_available;
            questionAnalysis.status = "success";
            questionAnalysis.message = "Full marks";
        } else {
            questionAnalysis.status = "danger";
            questionAnalysis.message = "Incorrect. No points";
        }

        return questionAnalysis;
    }

    $scope.markFreeFormQuestion = function(question){
        var questionAnalysis = {
            points_available: question.points_available,
            points_scored: 0,
            points_summary: function(){
                return this.points_scored + " / " + this.points_available;
            },
            status: "",
            message: ""
        }

        var keywords = question.desired_keywords.split(/[\s,]+/);
        var pointsPerKeyword = Math.round(question.points_available / keywords.length);

        keywords.forEach(function(kw){
            if(question.candidate_answer != null) {
                if (question.candidate_answer.indexOf(kw) > -1) {
                    questionAnalysis.points_scored += pointsPerKeyword;
                }
            }
        });

        if(questionAnalysis.points_scored >= questionAnalysis.points_available){
            questionAnalysis.status = "success";
            questionAnalysis.message = "Full marks. All keywords mentioned.";
        } else if (questionAnalysis.points_scored > 0){
            questionAnalysis.status = "warning";
            questionAnalysis.message = "Candidate scored " + questionAnalysis.points_summary();
        } else {
            questionAnalysis.status = "danger";
            questionAnalysis.message = "Candidate did not match any of the keywords.";
        }

        return questionAnalysis;
    }

    $scope.getCandidateState = function(candidateRecord) {
        if(candidateRecord == null) {
            return false;
        }
        var candidate = candidateRecord.candidate
        if(candidate.test_id){
            if(!candidate.test_sent){
                return "NotSent"
            }
            //Candidate has test assigned
            if(!candidate.test.test_started) {
                //Test sent but not started yet
                return "NotStarted";
            } else {
                //Candidate has started their test
                var expiredTime = new Date(candidate.test.test_expires);
                if(new Date() > expiredTime){
                //if(candidate.test.test_finished){
                    //Candidate has finished the test
                    return "Finished"; 
                } else {
                    //Candidate has started the test
                    return "Started";
                }
            }
        } else {
            //No test assigned to candidate yet
            return "NoTest";
        }
    }

    $scope.resendTest = function(){
        //resend test
    }

    $scope.saveCandidate = function() {
        testFactory.getTest($scope.candidate.candidate.test_id)
            .then(function(testData){
                $scope.candidate.candidate.test_sent = true;
                $scope.candidate.candidate.test = testData.data.test;
                candidateFactory.updateCandidate($scope.candidate._id, $scope.candidate)
                    .then(function(data){
                        candidateFactory.getCandidates()
                            .then(function(data){
                                $scope.test_data = data.data;
                                var modal = $('#candidateModal');
                                modal.modal('hide');
                            })
                    });
            });
    }

    $scope.addNewCandidate = function(){
        $state.go('createCandidate');
    }
});

app.controller('CreateCandidateController', function($scope, $http, $state, candidateFactory) {
    $scope.test_data = [];
    $scope.candidate = {
        candidate_name: '',
        candidate_email: ''
    }

    $scope.createCandidate = function(){
        candidateFactory.createCandidate($scope.candidate)
            .then(function(data){
                $state.go('myCandidates')
            });
    }
});

app.controller('TakeTestController', function($scope, $state, $http, $stateParams, candidateFactory) {

    $scope.test_data = {};

    candidateFactory.getTakeTest($stateParams.candidateId)
        .success(function(data) {
            $scope.test_data = data.candidate;
        });

    $scope.getEndTimeInUnix = function(){
        return new Date($scope.test_data.test.test_expires).getTime() / 1000;
    }

    $scope.currentQuestionIndex = 0;

    $scope.currentQuestionDisplayIndex = 0;

    $scope.getQuestionsTotalWithoutSections = function(){
        return $scope.test_data.test.questions.filter(function(x){return x.question_type != "section"}).length;
    }

    $scope.getCurrentQuestion = function(){
        if($scope.test_data && $scope.test_data.test && $scope.test_data.test.questions) {
            return $scope.test_data.test.questions[$scope.currentQuestionIndex];
        }
    }

    $scope.nextQuestion = function(){
        candidateFactory.saveTest($stateParams.candidateId, {candidate: $scope.test_data});

        if($scope.test_data.test.questions.length > ($scope.currentQuestionIndex + 1)){
            if($scope.test_data.test.questions[$scope.currentQuestionIndex + 1].question_type !== "section" && $scope.currentQuestionIndex > 0){
                $scope.currentQuestionDisplayIndex++;
            }
            return $scope.currentQuestionIndex++;
        }
        return $scope.currentQuestionIndex;
    }

    $scope.previousQuestion = function(){
        if($scope.currentQuestionIndex <= 0){
            $scope.currentQuestionIndex = 0;
            return $scope.currentQuestionIndex;
        }

        if($scope.test_data.test.questions[$scope.currentQuestionIndex - 1].question_type !== "section"){
            $scope.currentQuestionDisplayIndex--;
        }
        return $scope.currentQuestionIndex--;
    }

    $scope.getRemainingTime = function(){
        if($scope.test_data && $scope.test_data.test){
            //debugger;
            var expiredTime = new Date($scope.test_data.test.test_expires);
            if (!expiredTime) return false;

            var now = new Date();
            return (expiredTime - now);
        }
    }

    $scope.hasOnlyCorrectAnswer = function(question){
        var i = 0;
        question.possible_answers.forEach(function(entry) {
            if(entry.correct){
                i++;
            }
        });
        if (i === 1) {
            return true;
        }
        return false;
    }

    $scope.testExpired = function(){
        if($scope.test_data && $scope.test_data.test){
            //debugger;
            var expiredTime = new Date($scope.test_data.test.test_expires);
            if (!expiredTime) return false;

            var now = new Date();
            return (now > expiredTime);
        }
        return false;

    }

    $scope.StartTest = function(){
        candidateFactory.takeTest($stateParams.candidateId)
            .success(function(data) {
                $scope.test_data = data.candidate;
                $('#hideableHeader').hide();
                $('#introduction').animate({
                    height: "50px",
                    paddingTop: "0px",
                    paddingBottom: "0px"
                });
            });
    }

    $scope.SaveTest = function(){
        candidateFactory.saveTest($stateParams.candidateId, {candidate: $scope.test_data})
            .success(function(data){
                $state.go('myCandidates');
            });
    }

    $scope.answerChanged = function(){
        var question = $scope.test_data.test.questions[$scope.currentQuestionIndex];
        if(!question.answer_record){
            question.answer_record = [];
        }

        if(question.question_type === "freeform") {
            question.answer_record.push({
                answer_text: question.candidate_answer,
                answer_timestamp: new Date
            });
        } else if (question.question_type === "code") {
            question.answer_record.push({
                answer_text: question.filler_code,
                answer_timestamp: new Date
            });
        }

        candidateFactory.saveTest($stateParams.candidateId, {candidate: $scope.test_data});
    }
});

app.controller('TestSetupController', function($scope, $http, $stateParams, testFactory) {

    testFactory.getTest($stateParams.testId)
        .success(function(data) {
            $scope.test_data = data.test;
        });

    $scope.tagline = $stateParams.testName;

    $scope.hello = 'this works';

    //General Question methods
    $scope.removeQuestion = function(question){
        var index = $scope.test_data.questions.indexOf(question);
        $scope.test_data.questions.splice(index, 1);
    }

    var move = function (origin, destination) {
        var temp = $scope.test_data.questions[destination];
        $scope.test_data.questions[destination] = $scope.test_data.questions[origin];
        $scope.test_data.questions[origin] = temp;
    };

    $scope.moveUp = function(index){
        move(index, index - 1);
    };

    $scope.moveDown = function(index){
        move(index, index + 1);
    };

    //MCQ question methods
    $scope.addMcqQuestion = function(){
        $scope.testTheory = {
            "question_text": "",
            "possible_answers": [],
            "points_available": 10,
            "question_type": "mcq"
        }
        //show the modal
        $("#edit-mcq-question-index").val(-1);

        var modal = $('#mcqModal');
        modal.modal('show');
    }

    $scope.editMcqQuestion = function(question, indexOfQuestion) {
        $scope.testTheory = angular.copy(question);
        $("#edit-mcq-question-index").val(indexOfQuestion);
        var modal = $('#mcqModal');
        modal.modal('show');
    }
    $scope.saveMcqQuestion = function() {
        var indexOfQuestion = $("#edit-mcq-question-index").val();
        if (indexOfQuestion > -1) {
            $scope.test_data.questions[indexOfQuestion] = angular.copy($scope.testTheory);
        }
        else {
            $scope.test_data.questions.push(angular.copy($scope.testTheory));
        }

        var modal = $('#mcqModal');
        modal.modal('hide');
    }

    $scope.addMcqAnswer = function() {
        $scope.testTheory.possible_answers.push({'answer' : '', 'correct': false});
    }

    $scope.removeMcqAnswer = function(answer)
    {
        var index = $scope.testTheory.possible_answers.indexOf(answer);
        $scope.testTheory.possible_answers.splice(index, 1);
    }

    //Freeform question methods
    $scope.addFreeformQuestion = function(){
        $scope.testTheory = {
            "question_text": "",
            "desired_keywords": "",
            "points_available": 10,
            "question_type": "freeform"
        }

        $("#edit-freeform-question-id").val(-1);

        //show the modal
        var modal = $('#freeFormModal');
        modal.modal('show');
    }

    $scope.editFreeformQuestion = function(question, indexOfQuestion) {
        $('#edit-freeform-question-id').val(indexOfQuestion);;
        $scope.testTheory = angular.copy(question);

        var modal = $('#freeFormModal');
        modal.modal('show');
    }

    $scope.saveFreeformQuestion = function() {
        var indexOfQuestion = $("#edit-freeform-question-id").val();
        if (indexOfQuestion > -1) {
            $scope.test_data.questions[indexOfQuestion] = angular.copy($scope.testTheory);
        }
        else {
            $scope.test_data.questions.push(angular.copy($scope.testTheory));
        }

        var modal = $('#freeFormModal');
        modal.modal('hide');
    }

    //SECTION METHODS

    $scope.addSection = function(){
        $scope.testTheory = {
            "question_text": "",
            "points_available": 0,
            "question_type": "section"
        }

        $("#edit-section-question-id").val(-1);

        //show the modal
        var modal = $('#sectionModal');
        modal.modal('show');
    }

    $scope.editSection = function(question, indexOfQuestion) {
        $('#edit-section-question-id').val(indexOfQuestion);;
        $scope.testTheory = angular.copy(question);

        var modal = $('#sectionModal');
        modal.modal('show');
    }

    $scope.saveSectionBreak = function(){
        var indexOfQuestion = $("#edit-section-question-id").val();
        if (indexOfQuestion > -1) {
            $scope.test_data.questions[indexOfQuestion] = angular.copy($scope.testTheory);
        }
        else {
            $scope.test_data.questions.push(angular.copy($scope.testTheory));
        }

        var modal = $('#sectionModal');
        modal.modal('hide');
    }

    //CODE METHODS
    $scope.addCodeQuestion = function(){
        $scope.testTheory = {
            "question_text": "",
            "filler_code": "/// <summary>\n/// Consider putting some scaffolding \n/// code in here to help the candidate \n/// </summary> \npublic string Foo()\n{\n\t// Your Code Here\n\treturn string.empty;\n}",
            "points_available": 30,
            "question_type": "code"
        }
        //show the modal
        $("#edit-code-question-id").val(-1);

        var modal = $('#codeModal');
        modal.modal('show');
    }

    $scope.editCodeQuestion = function(question, indexOfQuestion) {
        $('#edit-code-question-id').val(indexOfQuestion);
        $scope.testTheory = angular.copy(question);

        var modal = $('#codeModal');
        modal.modal('show');
    }

    $scope.saveCodeQuestion = function() {
        var indexOfQuestion = $("#edit-code-question-id").val();
        if (indexOfQuestion > -1) {
            $scope.test_data.questions[indexOfQuestion] = angular.copy($scope.testTheory);
        }
        else {
            $scope.test_data.questions.push(angular.copy($scope.testTheory));
        }

        var modal = $('#codeModal');
        modal.modal('hide');
    }

    $scope.SaveTest = function() {
        var newTestData = {
            test:  $scope.test_data
        }

        testFactory.updateTest($stateParams.testId, newTestData)
            .then(function(response) {
                var modal = $('#saveModal');
                modal.modal('show');
            }, function(response) {
                alert("There was an error saving your test.");
            });
    }


});

app.factory('AuthenticationFactory', function($window) {
    var auth = {
        isLogged: false,
        check: function() {
            if ($window.sessionStorage.token && $window.sessionStorage.user) {
                this.isLogged = true;
            } else {
                this.isLogged = false;
                delete this.user;
            }
        }
    }

    return auth;
});

app.factory('UserAuthFactory', function($window, $state, $http, AuthenticationFactory) {
    return {
        login: function(username, password) {
            //debugger;
            return $http.post('/login', {
                username: username,
                password: password
            });
        },
        logout: function() {
            if (AuthenticationFactory.isLogged) {

                AuthenticationFactory.isLogged = false;
                delete AuthenticationFactory.user;
                delete AuthenticationFactory.userRole;

                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                delete $window.sessionStorage.userRole;

                $state.go("login");
            }

        },
        register: function(username, password) {
            return $http.post('/register', {
                username: username,
                password: password
            });
        }
    }
});

app.factory('TokenInterceptor', function($q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers['X-Access-Token'] = $window.sessionStorage.token;
                config.headers['X-Key'] = $window.sessionStorage.user;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },

        response: function(response) {
            return response || $q.when(response);
        }
    };
});

app.factory('testFactory', function($http) {

    var _testFactory = {};

    _testFactory.getTests = function() {
        return $http.get('/api/v1/tests');
    };

    _testFactory.getTest = function(testId) {
        return $http.get('/api/v1/test/' + testId);
    };

    _testFactory.deleteTest = function(testId) {
        return $http.delete('/api/v1/test/' + testId);
    };

    _testFactory.createTest = function(test) {
        return  $http.post('/api/v1/test', test);
    }

    _testFactory.updateTest = function(testId, test) {
        return $http.put('/api/v1/test/' + testId, test)
    }

    return _testFactory;
});

app.factory('candidateFactory', function($http) {

    var _candidateFactory = {};

    _candidateFactory.getCandidates = function() {
        return $http.get('/api/v1/candidates');
    };

    _candidateFactory.getCandidate = function(candidateId) {
        return $http.get('/api/v1/candidate/' + candidateId);
    };

    _candidateFactory.getTakeTest = function(candidateId) {
        return $http.get('/takeTest/' + candidateId);
    };

    _candidateFactory.takeTest = function(candidateId) {
        return $http.put('/takeTest/' + candidateId);
    };

    _candidateFactory.saveTest = function(candidateId, candidate) {
        return $http.post('/saveTest/' + candidateId, candidate);
    };

    _candidateFactory.deleteCandidate = function(candidateId) {
        return $http.delete('/api/v1/candidate/' + candidateId);
    };

    _candidateFactory.createCandidate = function(candidate) {
        return  $http.post('/api/v1/candidate', candidate);
    }

    _candidateFactory.updateCandidate = function(candidateId, candidate) {
        return $http.put('/api/v1/candidate/' + candidateId, candidate)
    }

    return _candidateFactory;
});