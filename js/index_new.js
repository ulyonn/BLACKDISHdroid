var app = {

    // represents the device capability of launching ARchitect Worlds with specific features
    isDeviceSupported: false,
    isArchitectWorldLoaded: false,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
        // set a callback for android that is called once the back button was clicked.
        if ( cordova.platformId == "android" ) {
            app.wikitudePlugin.setBackButtonCallback(app.onBackButton);
        } else { // assumes iOS is the only alternative
            app.wikitudePlugin.setErrorHandler(app.onRuntimeError);
        }
        app.wikitudePlugin.setJSONObjectReceivedCallback(app.onJSONObjectReceived);
    },
    continueLoadingExampleARchitectWorld: function(example) {
        /* cordova.file.applicationDirectory is used to demonstrate the use of the cordova file plugin in combination with the Wikitude plugin */
        /* The length check here is only necessary because for each example the same 'example' object is given here and we only want to change the path once. */
        if ( example.path.length > cordova.file.applicationDirectory ) {
            if ( example.path.substring(0, cordova.file.applicationDirectory) != cordova.file.applicationDirectory ) {
                example.path = cordova.file.applicationDirectory + example.path;
            }
        }

        /*app.prepareArchitectWorld(example, function() {
            //app.loadARchitectWorld(example);
        });*/
    },
    // --- Wikitude Plugin ---
    loadExampleARchitectWorld: function(example) {

        app.isArchitectWorldLoaded = false;

        if ( example.requiredExtension === "ObtainPoiDataFromApplicationModel" ) {
            navigator.geolocation.getCurrentPosition(
                function() {
                    app.continueLoadingExampleARchitectWorld(example);
                },
                function() {
                    alert("Failed to get the current device position.");
                });
        } else {
            app.continueLoadingExampleARchitectWorld(example);
        }
    },
    loadCustomARchitectWorldFromURL: function(url) {
        var customArchitectWorld = {
            "path":url,
            "requiredFeatures": [
                "image_tracking",
                "2d_tracking"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        };
        app.isArchitectWorldLoaded = false;
        app.prepareArchitectWorld(customArchitectWorld, function() {
            app.loadARchitectWorld(customArchitectWorld);
        });
    },
    prepareArchitectWorld: function(architectWorld, successCallback) {
        app.wikitudePlugin.isDeviceSupported(function() {
            app.wikitudePlugin.requestAccess(
                function() {
                    successCallback();
                },
                function(error) {
                    /* The error object contains two error messages.
                        * userDescription is a end user formatted message that can be displayed with e.g. a JS alert
                        * developerDescription is a developer formatted message with more detailed information about the error
                     */
                    /* Here, the userDescription is used to show a confirmation box which, in case of a positive result, shows the applications settings so that user can grant access. */
                    var openAppSettings = confirm(error.userDescription + '\nOpen App Settings?');
                    if ( openAppSettings == true ) {
                        app.wikitudePlugin.openAppSettings();
                    }
                },
                architectWorld.requiredFeatures);
        }, function(errorMessage) {
            alert(errorMessage);

        },
        architectWorld.requiredFeatures);
    },
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    loadARchitectWorld: function(architectWorld) {
      alert("A ver que pedo!?");
        app.wikitudePlugin.loadARchitectWorld(function successFn(loadedURL) {
          alert("Aqui esta pasando algo!?");
                /* Respond to successful world loading if you need to */
                app.isArchitectWorldLoaded = true;

                /* in case the loaded Architect World belongs to the 'obtain poi data from application model' example, we can now safely inject poi data. */
                if ( architectWorld.requiredExtension === "ObtainPoiDataFromApplicationModel" ) {
                    prepareApplicationDataModel();
                    injectGeneratedPoiJsonData();
                }
            }, function errorFn(error) {
                app.isArchitectWorldLoaded = false;
                alert('Loading AR web view failed: ' + error);
            },
            architectWorld.path, architectWorld.requiredFeatures, architectWorld.startupConfiguration
        );
    },
    // This function gets called if you call "AR.platform.sendJSONObject" in your ARchitect World
    onJSONObjectReceived: function (jsonObject) {
        if (typeof jsonObject.action !== 'undefined') {
            if ( jsonObject.action === "capture_screen" ) {
                app.wikitudePlugin.captureScreen(
                    function(absoluteFilePath) {
                        alert("snapshot stored at:\n" + absoluteFilePath);
                    },
                    function (errorMessage) {
                        alert(errorMessage);
                    },
                    true, null
                );
            } else if (jsonObject.action === "present_poi_details") {
                var alertMessage = "Poi '" + jsonObject.id + "' selected\nTitle: " + jsonObject.title + "\nDescription: " + jsonObject.description;
                alert(alertMessage);
            } else if (jsonObject.action === "save_current_instant_target") {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    fileSystem.root.getFile("SavedAugmentations.json", {create: true, exclusive: false}, function(fileEntry){
                        fileEntry.createWriter(function(writer){
                            writer.write(jsonObject.augmentations);
                        }, app.saveError);
                    }, app.saveError);
                }, app.saveError);
                app.wikitudePlugin.callJavaScript("World.saveCurrentInstantTargetToUrl(\"" + cordova.file.dataDirectory + "SavedInstantTarget.wto" + "\");")
            } else if (jsonObject.action === "load_existing_instant_target") {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    fileSystem.root.getFile("SavedAugmentations.json", null, function(fileEntry){
                        fileEntry.file(function(file){
                            var reader = new FileReader();
                            reader.onloadend = function(evt) {
                                var augmentations = evt.target.result;
                                app.wikitudePlugin.callJavaScript("World.loadExistingInstantTargetFromUrl(\"" + cordova.file.dataDirectory + "SavedInstantTarget.wto" + "\"," + augmentations + ");");
                            };
                            reader.readAsText(file);
                        }, app.loadError);
                    }, app.loadError);
                }, app.loadError);
            }
        }
    },
    saveError: function(error) {
        alert("Could not save the current instant target.");
    },
    loadError: function(error) {
        alert("Could not load instant target, please save it first.");
    },
    onRuntimeError: function (error) {
        if (error.code == 960) {
            var openAppSettings = confirm(error.message + '\nOpen App Settings?');
            if (openAppSettings == true) {
                app.wikitudePlugin.openAppSettings();
            }
        }
    },
    onBackButton: function () {
        /* Android back button was pressed and the Wikitude PhoneGap Plugin is now closed */
    },
    showBuildInformation: function() {
        var sdkVersion = ""

        app.wikitudePlugin.getSDKVersion(function(version){ sdkVersion = version });

        app.wikitudePlugin.getSDKBuildInformation(function(buildInformationJSON) {
            var buildInformation = JSON.parse(buildInformationJSON);
            alert(
                "Build configuration: " + buildInformation.buildConfiguration + "\n" +
                "Build date: " + buildInformation.buildDate + "\n" +
                "Build number: " + buildInformation.buildNumber + "\n" +
                "Build version: " + sdkVersion
            );
        });
    }
    // --- End Wikitude Plugin ---
};

//app.initialize();
