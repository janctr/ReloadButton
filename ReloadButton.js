define([
    'qlik',
    'text!./template.html',
    'text!./modal.html',
    'css!./index.css',
], function (qlik, template, modal) {
    function removeExtensionHeader(layout) {
        $(`#${layout.qInfo.qId}_title`).remove();
    }

    function enableButton() {
        $('.reload-button').removeAttr('disabled');
    }

    function disableButton() {
        $('.reload-button').attr('disabled', true);
    }

    return {
        template: template,
        support: {
            snapshot: true,
            export: true,
            exportData: false,
        },
        paint: function () {
            return qlik.Promise.resolve();
        },
        controller: [
            '$scope',
            function ($scope) {
                //add your rendering code here
                $scope.isReloading = false;
                $scope.isError = false;
                $scope.buttonText = 'Reload';

                removeExtensionHeader($scope.layout);

                $scope.doReload = async function () {
                    $scope.buttonText = 'Reloading...';
                    $scope.isReloading = true;
                    disableButton();

                    let hasReloaded = false;

                    try {
                        hasReloaded = await qlik
                            .currApp()
                            .model.engineApp.doReload();
                    } catch (err) {
                        $scope.isError = false;
                    }

                    if (hasReloaded) {
                        console.log('reloaded app: ', hasReloaded);

                        qlik.currApp().model.engineApp.doSave();
                    }

                    $scope.isReloading = false;
                    $scope.buttonText = 'Reload';
                    enableButton();
                };
            },
        ],
    };
});
