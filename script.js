function buildStringFrom(text){
  if (!text) return '';
  text = ' '+ text.split('').join(' ') + ' '
  var toReturn = ''
  var textArr = text.split('')
  for (var i = 0; i<=6; i++){
    textArr.forEach(function(letter){
      toReturn += map[letter][i]
    })
    toReturn += '\n'
  }
  return toReturn;
}

var convertToEmoji = function(str, light, dark){
  str = str.toLowerCase()
  str = buildStringFrom(str)
  return str.replaceAll(/0|1/g, function(match) { return match === '0' ? light : dark })
}

var app = angular.module('emojiConverter', [])

app.controller('MainCtrl', function($scope){
  const searchParamKey = 'q'
  const search = new URLSearchParams(window.location.search)

  $scope.inputStr =  search.get(searchParamKey) || 'AnNoY'
  $scope.lightSquare = ':white_square:'
  $scope.darkSquare = ':black_square:'

  $scope.convert = function(){
    if (!checkInput()) return;
    $scope.output = convertToEmoji($scope.inputStr, $scope.lightSquare, $scope.darkSquare)
    $scope.renderedOutput = $scope.output.replaceAll($scope.lightSquare, "⬜️").replaceAll($scope.darkSquare, "⬛️")

    if ($scope.output.length >  4000) {
      $scope.error = 'You are over the Slack character limit! Try using a shorter emoji name or less characters'
    } else {
      const newSearch = new URLSearchParams()
      newSearch.set(searchParamKey, $scope.inputStr)
      const newSearchString = newSearch.toString()
      window.history.replaceState({}, window.document.title, window.location.pathname + newSearchString ? `?${newSearchString}` : '');
    }
  }

  function checkInput() {
    $scope.error = ''
    if ($scope.inputStr && $scope.inputStr.match(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/)){
      $scope.error = "Sorry, punctuation is not yet supported"
      return false
    }

    return true
  }
  
  $scope.copyToClipboard = function(){
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = $scope.output
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
  };

  $scope.error = ''

  // Bootstrap on load
  $scope.convert()
})

app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
});
