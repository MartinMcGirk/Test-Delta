angular.module('appRoutes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url:'/',
			templateUrl: 'views/home.html',
			controller: 'MainController',
			data: {
				requireLogin: false
			}
		})
		.state('demoTest', {
			url:'/DemoTest',
			templateUrl: 'views/DemoTest.html',
			controller: 'DemoTestController',
			data: {
				requireLogin: false
			}
		})
//		.state('createTest.addQuestions', {
//			url:'/AddQuestions',
//			templateUrl: 'views/partials/AddQuestions.html'
//		})
//		.state('createTest.addQuestions.table', {
//			url:'/table',
//			templateUrl: 'views/partials/table.html'
//		})
		.state('createTest', {
			url:'/CreateTest',
			templateUrl: 'views/CreateTest.html',
			controller: 'CreateTestController',
			data: {
				requireLogin: true
			}
		})
//		.state('createTest.table', {
//			url: '/table',
//			templateUrl: 'views/partials/table.html'
//		})
		.state('testSetup', {
			url: '/TestSetup/:testId',
			templateUrl: 'views/TestSetup.html',
			controller: 'TestSetupController',
			data: {
				requireLogin: true
			}
		})
		.state('myTests', {
			url: '/MyTests',
			templateUrl: 'views/MyTests.html',
			controller: 'MyTestsController',
			data: {
				requireLogin: true
			}
		})
		.state('takeTest', {
			url:'/TakeTest/:testId',
			templateUrl: 'views/TakeTest.html',
			controller: 'TakeTestController',
			data: {
				requireLogin: true
			}
		})
		.state('adminUser', {
			url:'/AdminUser',
			templateUrl: 'views/AdminUser.html',
			controller: 'AdminUserController',
			data: {
				requireLogin: false
			}
		})
}]);
