var app = angular.module('myApp', ["ngRoute", "ngAnimate", "ngStorage"]);
var test;

var i = 0; // numéro de buller , son id sera B+"i"
            var e1 = 0; //nombre de fois ou l'enemmie 1 est touché par une bullet
            var e2 = 0; //nombre de fois ou l'enemmie 2 est touché par une bullet
            var e3 = 0; //nombre de fois ou l'enemmie 3 est touché par une bullet
            var e4 = 0; //nombre de fois ou l'enemmie 4 est touché par une bullet

// rootage : angular js			
app.config(function($routeProvider) {

    //system de routage	  
    $routeProvider
        .when('/accueil', {
            templateUrl: 'accueilID',
            animation: 'accueil'
        })
        .when('/game', {
            templateUrl: 'gameID',
            animation: 'game'
        })

    .when('/finish', {
            templateUrl: 'finishID',
            animation: 'game'
        })
        .otherwise({
            templateUrl: 'accueilID',
            animation: 'accueil'
        });
});



// controlleur local storage : angular js		
app.controller("StorageController", function($scope, $localStorage) {
    $scope.name = $localStorage.message;
    $scope.data = $scope.name;
    $scope.save = function() {
        $localStorage.message = $scope.name;
    }

    $scope.load = function() {
        $scope.data = $localStorage.message;
    }

});

//controlleur du jeux
app.controller('myCtrl', function($scope, $location) {

    $scope.score = 0;
    $scope.left = 50;

    $scope.hightbullet = 90;
    $scope.right = 0;
    $scope.bullets = [];
    $scope.idbullet;
    
    var musiqueDeFond = new Audio('sounds/sound.mp3');
    var bulletSound = new Audio('sounds/bullet.wav');
	var explosionEffect = new Audio('sounds/explosion.mp3'); //  un ennemie est frappé par une balle
	var dead = new Audio('sounds/dead.mp3'); // un ennemie est mort
    musiqueDeFond.play();
    test = true;
    //39right
    //37left
    //32espace




    //get the ascii code of pressed button
    $scope.click = function($event) {
        var ascii = $event.keyCode;
        console.log(ascii);
        if (ascii == 37 && $scope.left > 0) {
            $scope.left = $scope.left - 2;
            //console.log("swipe left");
        }
        if (ascii == 39 && $scope.left < 90) {
            $scope.left = $scope.left + 2;
            //console.log("swipe right");
        }
        if (ascii == 32) {

            if (test == true) {
                test = false;

                $scope.idbullet = (i.toString()).concat("b");
                idBulletForTest = $scope.idbullet;
                i++;
                bulletSound.play();
                $scope.bullets.push({
                    leftbullet: $scope.left + 4.6,
                    show: true,
                    id: $scope.idbullet
                });
                //console.log("tir");
            }
        }

    }


    $scope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
        $scope.animation = currRoute.animation;

    });
    $scope.go = function(pagePath) {

        $location.path(pagePath);

    }
	
    setInterval(testFun, 250); // pour séparer le temps entre les boulles

    setInterval(testCollision, 100); // pour tester les collisions, calculer le score, supprimer les ennemies morts
    setInterval(garbageCollector, 4000);  // pour supprimer les bullets dont j'ai plus besoin "pour ne pas encombrer le html avec ng-repeate"

    function testCollision() {

        angular.forEach($scope.bullets, function(bullet) {
        

            var overlap1 = isOverlap("#o1", "#" + bullet.id);
            var overlap2 = isOverlap("#o2", "#" + bullet.id);
            var overlap3 = isOverlap("#o3", "#" + bullet.id);


            var overlap4 = isOverlap("#enemy1", "#" + bullet.id);
            var overlap5 = isOverlap("#enemy3", "#" + bullet.id);
            var overlap6 = isOverlap("#enemy2", "#" + bullet.id);
            var overlap7 = isOverlap("#enemy4", "#" + bullet.id);

            if (overlap1 || overlap2 || overlap3) {

                $scope.bullets.splice($.inArray(bullet, $scope.bullets), 1);

                document.getElementById(bullet.id).remove();
                console.log("yeeeeeesssssss");
                // bullet a frapper les obstacles
            } 

            if (overlap4) {
                 explosionEffect.play();
                $scope.bullets.splice($.inArray(bullet, $scope.bullets), 1);
                document.getElementById(bullet.id).remove();
                $scope.score = $scope.score + 40;
				 // bullet a frapper un ennemie
                e1++;
                if (e1 >= 3) {
					dead.play();
                    var element = document.getElementById("enemy1");
                    element.parentNode.removeChild(element);
                    // l'ennemie est frappé plus de trois fois ----> if doit mourir

                    e1 = 0;
                }
            }

            if (overlap5) {
                explosionEffect.play();
                $scope.bullets.splice($.inArray(bullet, $scope.bullets), 1);


                document.getElementById(bullet.id).remove();
                $scope.score = $scope.score + 40;
				// bullet a frapper un ennemie
                e2++;
                if (e2 >= 3) {
					dead.play();
					//l'ennemie doit mourir
                    var element = document.getElementById("enemy3");
                    element.parentNode.removeChild(element);

                    e2 = 0;
                }
            }

            if (overlap6) {
                 explosionEffect.play();
                $scope.bullets.splice($.inArray(bullet, $scope.bullets), 1);


                document.getElementById(bullet.id).remove();
                $scope.score = $scope.score + 20;
				// bullet a frapper un ennemie
                e3++;
                if (e3 >= 3) {
					dead.play();
					//l'ennemie doit mourir
                    var element = document.getElementById("enemy2");
                    element.parentNode.removeChild(element);
                    e3 = 0;
                }
            }
            if (overlap7) {
                 explosionEffect.play();
                $scope.bullets.splice($.inArray(bullet, $scope.bullets), 1);

                document.getElementById(bullet.id).remove();
                $scope.score = $scope.score + 20;
				// bullet a frapper un ennemie
                e4++;
                if (e4 >= 3) {
					dead.play();
					//l'ennemie doit mourir
                    var element = document.getElementById("enemy4");
                    element.parentNode.removeChild(element);

                    e4 = 0;
                }
            }



        })
    }

  //vider le tableau bullets qui contient les bullets
    function garbageCollector() {

        angular.forEach($scope.bullets, function(bullet) {
            $scope.bullets.splice($.inArray(bullet, $scope.bullets), 1);

        })

    }


    /*
    domBullet = document.getElementsByClassName("bullet");
    domObstacle1 = document.getElementsByClassName("obstacle");
    */

});




function testFun() {
    test = true;

}



/* jQuery pour tester les collisions entre les DOM */


function isOverlap(idOne, idTwo) {
    var objOne = $(idOne),
        objTwo = $(idTwo),
        offsetOne = objOne.offset(),
        offsetTwo = objTwo.offset(),
        topOne = ($(idOne).offset() || {
            "top": NaN
        }).top,
        topTwo = ($(idTwo).offset() || {
            "top": NaN
        }).top,
        leftOne = ($(idOne).offset() || {
            "left": NaN
        }).left,
        leftTwo = ($(idTwo).offset() || {
            "left": NaN
        }).left,
        widthOne = objOne.width(),
        widthTwo = objTwo.width(),
        heightOne = objOne.height(),
        heightTwo = objTwo.height();

    var leftTop = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
        rightTop = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
        leftBottom = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne,
        rightBottom = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne;
    return leftTop || rightTop || leftBottom || rightBottom;
}