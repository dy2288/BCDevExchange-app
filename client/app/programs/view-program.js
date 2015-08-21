/*
Copyright 2015 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

'use strict'

angular.module('bcdevxApp.programs').controller('ViewProgramCtrl', ['ProgramService', '$routeParams', '$rootScope', '$scope', 'Programs', function (ProgramService, $routeParams, $rootScope, $scope, Programs) {
    $scope.mdDisplay = ''

    var mdContentPromise = ProgramService.getProgramByName($routeParams.programName)
    $scope.programName = $routeParams.programName
    $scope.programs = Programs
    mdContentPromise.then(function (program) {
      if (!!program) {
        $scope.program = program
        $scope.mdDisplay = program.markdown
        $rootScope.$broadcast('bdTocUpdate')
      } else {
        $scope.mdDisplay = 'No content found for program named \'' + $routeParams.programName + '\'.'
      }

    }, function (errorMessage) {
      $scope.mdDisplay = errorMessage
    })

    try {
      // Turn off automatic editor creation first.
      window.CKEDITOR.disableAutoInline = true
      var editor = window.CKEDITOR.inline('editor1')
      editor.on('blur', function (evt) {
        var programPatch = {
          content: {
            description: this.getData()
          }
        }
        $scope.programs.update({
          id: $scope.program.id
        }, programPatch)
      })
    } catch (e) {}
}
])
