var app = angular.module('senseWebtool', ['ui.multiselect', 'ajoslin.promise-tracker', 'ui.bootstrap']);

// request parameters
var baseUri = getParameterByName('base_uri');
var fileId = getParameterByName('fileId');


//Initialise app
//====================================================================================================================================
app.run(function($rootScope, promiseTracker, $location) {
    $rootScope.loadingTracker = promiseTracker();

    var _preventNavigation = false;
    var _preventNavigationUrl = null;

    $rootScope.allowNavigation = function() {
        _preventNavigation = false;
    };

    $rootScope.preventNavigation = function() {
        _preventNavigation = true;
        _preventNavigationUrl = $location.absUrl();
    }

    //Warn before navigating out of the web form if there is unsaved information
    window.onbeforeunload = function() {
        //preventNavigation will be set if the form is dirty.
        if (_preventNavigation && $location.absUrl() == _preventNavigationUrl) {
            return "You have unsaved changes, do you want to continue?";
        }

    }

});



//Main controller
//====================================================================================================================================
app.controller("mainController", function($scope, $rootScope, $timeout, $http, dataRepository) {
    //Get empty instance
    dataRepository.loadEmptyInstance().error(function() {
        alert("Failed to read empty instance XML file.");
    }).success(function(instance) {
        $scope.emptyInstance = instance;
    });
    //Get previously filled out instance
    dataRepository.loadInstance().error(function() {
        alert("Failed to read instance XML file.");
    }).success(function(instance) {
        $scope.instance = instance;

        // convert repeat hashes (if there is only one row) to arrays
        $scope.initArray('rdf:RDF', 'dcat:Dataset');
        $scope.initArray('rdf:RDF', 'dcat:Distribution');
        $scope.initArray('rdf:RDF', 'sense:IndicatorAssessment');

        $scope.initDefaults();

    });


    //Initialise default values
    $scope.initDefaults = function() {

            //Define storage for alerts
            $scope.alerts = [];

            //Set id's if empty instance
            if (!$scope.instance['rdf:RDF']['foaf:Organization']['@rdf:about']) {
                $scope.instance['rdf:RDF']['foaf:Organization']['@rdf:about'] = createGuid();
                $scope.instance['rdf:RDF']['dcat:Catalog']['dct:publisher']['@rdf:resource'] = $scope.instance['rdf:RDF']['foaf:Organization']['@rdf:about'];
            }
            if (!$scope.instance['rdf:RDF']['dcat:Catalog']['@rdf:about']) {
                $scope.instance['rdf:RDF']['dcat:Catalog']['@rdf:about'] = createGuid();
            }
            if (!$scope.instance['rdf:RDF']['dcat:Dataset'][0]['@rdf:about']) {
                $scope.instance['rdf:RDF']['dcat:Dataset'][0]['@rdf:about'] = createGuid();
            }
            if (!$scope.instance['rdf:RDF']['dcat:Distribution'][0]['@rdf:about']) {
                $scope.instance['rdf:RDF']['dcat:Distribution'][0]['@rdf:about'] = createGuid();
            }
            if (!$scope.instance['rdf:RDF']['sense:IndicatorAssessment'][0]['@rdf:about']) {
                $scope.instance['rdf:RDF']['sense:IndicatorAssessment'][0]['@rdf:about'] = createGuid();
            }

            //Paths (for adding ng-repeat items)
            $scope.datasetpath = 'rdf:RDF.dcat:Dataset';
            $scope.distributionpath = 'rdf:RDF.dcat:Distribution';
            $scope.indicatorAssessmentPath = 'rdf:RDF.sense:IndicatorAssessment';

            //Option lists
            $scope.options = {};
            $scope.options.years = [];
            var currentYear = new Date().getFullYear();
            for (var i = currentYear; i >= currentYear - 50; i--) {
                $scope.options.years.push({
                    code: i,
                    label: i
                });
            }
            $scope.options.formats = [{code:'http://publications.europa.eu/resource/authority/file-type/AZW',label:'Amazon Kindle eBook'},{code:'http://publications.europa.eu/resource/authority/file-type/CSV',label:'CSV'},{code:'http://publications.europa.eu/resource/authority/file-type/DBF',label:'DBF'},{code:'http://publications.europa.eu/resource/authority/file-type/E00',label:'E00'},{code:'http://publications.europa.eu/resource/authority/file-type/EPUB',label:'EPUB'},{code:'http://publications.europa.eu/resource/authority/file-type/XLS',label:'Excel XLS'},{code:'http://publications.europa.eu/resource/authority/file-type/FMX4',label:'Formex 4'},{code:'http://publications.europa.eu/resource/authority/file-type/GIF',label:'GIF'},{code:'http://publications.europa.eu/resource/authority/file-type/GZIP',label:'GNU zip'},{code:'http://publications.europa.eu/resource/authority/file-type/HTML',label:'HTML'},{code:'http://publications.europa.eu/resource/authority/file-type/JPEG',label:'JPEG'},{code:'http://publications.europa.eu/resource/authority/file-type/JSON',label:'JSON'},{code:'http://publications.europa.eu/resource/authority/file-type/KML',label:'KML'},{code:'http://publications.europa.eu/resource/authority/file-type/MDB',label:'MDB'},{code:'http://publications.europa.eu/resource/authority/file-type/MOBI',label:'Mobipocket eBook'},{code:'http://publications.europa.eu/resource/authority/file-type/MOP',label:'MOP'},{code:'http://publications.europa.eu/resource/authority/file-type/MXD',label:'MXD'},{code:'http://publications.europa.eu/resource/authority/file-type/PDF',label:'PDF'},{code:'http://publications.europa.eu/resource/authority/file-type/PDFA1A',label:'PDF/A-1a'},{code:'http://publications.europa.eu/resource/authority/file-type/PDFA1B',label:'PDF/A-1b'},{code:'http://publications.europa.eu/resource/authority/file-type/PDFX',label:'PDF/X'},{code:'http://publications.europa.eu/resource/authority/file-type/TXT',label:'Plain text'},{code:'http://publications.europa.eu/resource/authority/file-type/PNG',label:'PNG'},{code:'http://publications.europa.eu/resource/authority/file-type/PPSX',label:'PowerPoint PPSX'},{code:'http://publications.europa.eu/resource/authority/file-type/PPT',label:'PowerPoint PPT'},{code:'http://publications.europa.eu/resource/authority/file-type/PPTX',label:'PowerPoint PPTX'},{code:'http://publications.europa.eu/resource/authority/file-type/RDF_XML',label:'RDF'},{code:'http://publications.europa.eu/resource/authority/file-type/RTF',label:'RTF'},{code:'http://publications.europa.eu/resource/authority/file-type/SGML',label:'SGML'},{code:'http://publications.europa.eu/resource/authority/file-type/SKOS_XML',label:'SKOS'},{code:'http://publications.europa.eu/resource/authority/file-type/SPARQLQ',label:'SPARQL'},{code:'http://publications.europa.eu/resource/authority/file-type/SPARQLQRES',label:'SPARQL results'},{code:'http://publications.europa.eu/resource/authority/file-type/TIFF',label:'TIFF'},{code:'http://publications.europa.eu/resource/authority/file-type/TSV',label:'TSV'},{code:'http://publications.europa.eu/resource/authority/file-type/DOC',label:'Word DOC'},{code:'http://publications.europa.eu/resource/authority/file-type/DOCX',label:'Word DOCX'},{code:'http://publications.europa.eu/resource/authority/file-type/XHTML',label:'XHTML'},{code:'http://publications.europa.eu/resource/authority/file-type/XLSX',label:'XLSX'},{code:'http://publications.europa.eu/resource/authority/file-type/XML',label:'XML'},{code:'http://publications.europa.eu/resource/authority/file-type/XSLT',label:'XSLT'},{code:'http://publications.europa.eu/resource/authority/file-type/ZIP',label:'ZIP'}];
            $scope.options.skosMatchTypes = [{ code: 'closeMatch', label: 'SKOS closeMatch' }, { code: 'relatedMatch', label: 'SKOS relatedMatch' }];
            $scope.options.spatial = [{code:"http://publications.europa.eu/mdr/authority/country/ALB",label:"Albania"},{code:"http://publications.europa.eu/mdr/authority/country/AUT",label:"Austria"},{code:"http://publications.europa.eu/mdr/authority/country/BEL",label:"Belgium"},{code:"http://publications.europa.eu/mdr/authority/country/BIH",label:"Bosnia and Herzegovina"},{code:"http://publications.europa.eu/mdr/authority/country/BGR",label:"Bulgaria"},{code:"http://publications.europa.eu/mdr/authority/country/HRV",label:"Croatia"},{code:"http://publications.europa.eu/mdr/authority/country/CYP",label:"Cyprus"},{code:"http://publications.europa.eu/mdr/authority/country/CZE",label:"Czech Republic"},{code:"http://publications.europa.eu/mdr/authority/country/DNK",label:"Denmark"},{code:"http://publications.europa.eu/mdr/authority/country/EST",label:"Estonia"},{code:"http://publications.europa.eu/mdr/authority/country/FIN",label:"Finland"},{code:"http://publications.europa.eu/mdr/authority/country/MKD",label:"Former Yugoslav Republic of Macedonia"},{code:"http://publications.europa.eu/mdr/authority/country/FRA",label:"France"},{code:"http://publications.europa.eu/mdr/authority/country/DEU",label:"Germany"},{code:"http://publications.europa.eu/mdr/authority/country/GRC",label:"Greece"},{code:"http://publications.europa.eu/mdr/authority/country/HUN",label:"Hungary"},{code:"http://publications.europa.eu/mdr/authority/country/ISL",label:"Iceland"},{code:"http://publications.europa.eu/mdr/authority/country/IRL",label:"Ireland"},{code:"http://publications.europa.eu/mdr/authority/country/ITA",label:"Italy"},{code:"http://publications.europa.eu/mdr/authority/country/1A0",label:"Kosovo"},{code:"http://publications.europa.eu/mdr/authority/country/LVA",label:"Latvia"},{code:"http://publications.europa.eu/mdr/authority/country/LIE",label:"Liechtenstein"},{code:"http://publications.europa.eu/mdr/authority/country/LTU",label:"Lithuania"},{code:"http://publications.europa.eu/mdr/authority/country/LUX",label:"Luxembourg"},{code:"http://publications.europa.eu/mdr/authority/country/MLT",label:"Malta"},{code:"http://publications.europa.eu/mdr/authority/country/MNE",label:"Montenegro"},{code:"http://publications.europa.eu/mdr/authority/country/NLD",label:"Netherlands"},{code:"http://publications.europa.eu/mdr/authority/country/NOR",label:"Norway"},{code:"http://publications.europa.eu/mdr/authority/country/POL",label:"Poland"},{code:"http://publications.europa.eu/mdr/authority/country/PRT",label:"Portugal"},{code:"http://publications.europa.eu/mdr/authority/country/ROU",label:"Romania"},{code:"http://publications.europa.eu/mdr/authority/country/SRB",label:"Serbia"},{code:"http://publications.europa.eu/mdr/authority/country/SVK",label:"Slovakia"},{code:"http://publications.europa.eu/mdr/authority/country/SVN",label:"Slovenia"},{code:"http://publications.europa.eu/mdr/authority/country/ESP",label:"Spain"},{code:"http://publications.europa.eu/mdr/authority/country/SWE",label:"Sweden"},{code:"http://publications.europa.eu/mdr/authority/country/CHE",label:"Switzerland"},{code:"http://publications.europa.eu/mdr/authority/country/TUR",label:"Turkey"},{code:"http://publications.europa.eu/mdr/authority/country/GBR",label:"United Kingdom"}];
            $scope.options.eurovocThemes = [{"code":"http://eurovoc.europa.eu/100142","label":"Politics"},{"code":"http://eurovoc.europa.eu/100143","label":"International relations"},{"code":"http://eurovoc.europa.eu/100144","label":"European communities"},{"code":"http://eurovoc.europa.eu/100145","label":"Law"},{"code":"http://eurovoc.europa.eu/100146","label":"Economics"},{"code":"http://eurovoc.europa.eu/100147","label":"Trade"},{"code":"http://eurovoc.europa.eu/100148","label":"Finance"},{"code":"http://eurovoc.europa.eu/100149","label":"Social questions"},{"code":"http://eurovoc.europa.eu/100150","label":"Education and communications"},{"code":"http://eurovoc.europa.eu/100151","label":"Science"},{"code":"http://eurovoc.europa.eu/100152","label":"Business and competition"},{"code":"http://eurovoc.europa.eu/100153","label":"Employment and working conditions"},{"code":"http://eurovoc.europa.eu/100154","label":"Transport"},{"code":"http://eurovoc.europa.eu/100155","label":"Environment"},{"code":"http://eurovoc.europa.eu/100156","label":"Agriculture, forestry and fisheries"},{"code":"http://eurovoc.europa.eu/100157","label":"Agri-foodstuffs"},{"code":"http://eurovoc.europa.eu/100158","label":"Production, technology and research"},{"code":"http://eurovoc.europa.eu/100159","label":"Energy"},{"code":"http://eurovoc.europa.eu/100160","label":"Industry"},{"code":"http://eurovoc.europa.eu/100161","label":"Geography"},{"code":"http://eurovoc.europa.eu/100162","label":"International organisations"}];
            $scope.options.eeaThemes =[{"code":"http://www.eea.europa.eu/themes/agriculture","label":"Agriculture"},{"code":"http://www.eea.europa.eu/themes/air","label":"Air pollution"},{"code":"http://www.eea.europa.eu/themes/biodiversity","label":"Biodiversity"},{"code":"http://www.eea.europa.eu/themes/chemicals","label":"Chemicals"},{"code":"http://www.eea.europa.eu/themes/climate","label":"Climate change"},{"code":"http://www.eea.europa.eu/themes/coast_sea","label":"Coasts and seas"},{"code":"http://www.eea.europa.eu/themes/energy","label":"Energy"},{"code":"http://www.eea.europa.eu/themes/human","label":"Environment and health"},{"code":"http://www.eea.europa.eu/themes/scenarios","label":"Environmental scenarios"},{"code":"http://www.eea.europa.eu/themes/technology","label":"Environmental technology"},{"code":"http://www.eea.europa.eu/themes/environmental-themes","label":"Environmental topics"},{"code":"http://www.eea.europa.eu/themes/fishery","label":"Fisheries"},{"code":"http://www.eea.europa.eu/themes/economy","label":"Green economy"},{"code":"http://www.eea.europa.eu/themes/households","label":"Household consumption"},{"code":"http://www.eea.europa.eu/themes/industry","label":"Industry"},{"code":"http://www.eea.europa.eu/themes/landuse","label":"Land use"},{"code":"http://www.eea.europa.eu/themes/natural","label":"Natural resources"},{"code":"http://www.eea.europa.eu/themes/noise","label":"Noise"},{"code":"http://www.eea.europa.eu/themes/policy","label":"Policy instruments"},{"code":"http://www.eea.europa.eu/themes/soil","label":"Soil"},{"code":"http://www.eea.europa.eu/themes/regions","label":"Specific regions"},{"code":"http://www.eea.europa.eu/themes/tourism","label":"Tourism"},{"code":"http://www.eea.europa.eu/themes/transport","label":"Transport"},{"code":"http://www.eea.europa.eu/themes/urban","label":"Urban environment"},{"code":"http://www.eea.europa.eu/themes/other_issues","label":"Various other issues"},{"code":"http://www.eea.europa.eu/themes/waste","label":"Waste and material resources"},{"code":"http://www.eea.europa.eu/themes/water","label":"Water"}];
            $scope.options.indicators = [{"code":"http://www.eea.europa.eu/data-and-maps/indicators/aquaculture-production-1","label":"EEA: Aquaculture production (CSI 033)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/area-under-organic-farming-1","label":"EEA: Area under organic farming (CSI 026)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/atmospheric-greenhouse-gas-concentrations-3","label":"EEA: Atmospheric greenhouse gas concentrations (CSI 013/CLIM 052)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/bathing-water-quality","label":"EEA: Bathing water quality (CSI 022/WAT 004)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/chlorophyll-in-transitional-coastal-and","label":"EEA: Chlorophyll in transitional, coastal and marine waters (CSI 023)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/designated-areas","label":"EEA: Designated areas (CSI 008)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/emissions-of-acidifying-substances-version-2","label":"EEA: Emissions of acidifying substances (CSI 001/APE 007)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/emissions-of-ozone-precursors-version-2","label":"EEA: Emissions of ozone precursors (CSI 002/APE 008)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/emissions-of-primary-particles-and-5","label":"EEA: Emissions of primary PM2.5 and PM10 particulate matter  (CSI 003/APE 009)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/exceedance-of-air-quality-limit-3","label":"EEA: Exceedance of air quality limit values in urban areas (CSI 004)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/exposure-of-ecosystems-to-acidification-2","label":"EEA: Exposure of ecosystems to acidification, eutrophication and ozone (CSI 005)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/final-energy-consumption-by-sector-8","label":"EEA: Final energy consumption by sector and fuel (CSI 027/ENER 016)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/fishing-fleet-capacity","label":"EEA: Fishing fleet capacity (CSI 034)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/freight-transport-demand-version-2","label":"EEA: Freight transport demand (CSI 036/TERM 013)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/global-and-european-temperature","label":"EEA: Global and European temperature (CSI 012/CLIM 001)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/greenhouse-gas-emission-projections","label":"EEA: Progress to greenhouse gas emission targets (CSI 011/CLIM 051)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/greenhouse-gas-emission-trends-5","label":"EEA: Total greenhouse gas (GHG) emission trends and projections (CSI 010/CLIM 050)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/gross-nutrient-balance-1","label":"EEA: Gross nutrient balance (CSI 025)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/land-take-2","label":"EEA: Land take (CSI 014/LSI 001)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/municipal-waste-generation","label":"EEA: Municipal waste generation (CSI 016/WST 001)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/nutrients-in-freshwater","label":"EEA: Nutrients in freshwater (CSI 020/WAT 003)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/nutrients-in-transitional-coastal-and","label":"EEA: Nutrients in transitional, coastal and marine waters (CSI 021)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/oxygen-consuming-substances-in-rivers","label":"EEA: Oxygen consuming substances in rivers (CSI 019/WAT 002)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/passenger-transport-demand-version-2","label":"EEA: Passenger transport demand (CSI 035/TERM 012)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/primary-energy-consumption-by-fuel-3","label":"EEA: Total Gross Inland Consumption by Fuel (CSI 029/ENER 026)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/production-and-consumption-of-ozone","label":"EEA: Production and consumption of ozone depleting substances (CSI 006)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/progress-in-management-of-contaminated-sites-3","label":"EEA: Progress in management of contaminated sites (CSI 015/LSI 003)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/renewable-electricity-consumption-1","label":"EEA: Renewable electricity (CSI 031/ENER 030)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/renewable-primary-energy-consumption-3","label":"EEA: Renewable energy in gross inland energy consumption (CSI 030/ENER 029)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/species-diversity","label":"EEA: Species diversity (CSI 009)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/species-of-european-interest","label":"EEA: Species of European interest (SEBI 003/CSI 007)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/status-of-marine-fish-stocks","label":"EEA: Status of marine fish stocks (CSI 032)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/total-primary-energy-intensity-1","label":"EEA: Energy intensity (CSI 028/ENER 017)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/urban-waste-water-treatment","label":"EEA: Urban waste water treatment (CSI 024/WAT 005)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/use-of-cleaner-and-alternative-fuels","label":"EEA: Use of cleaner and alternative fuels (CSI 037/TERM 031)"},{"code":"http://www.eea.europa.eu/data-and-maps/indicators/use-of-freshwater-resources","label":"EEA: Use of freshwater resources (CSI 018/WAT 001)"},{"code":"http://epp.eurostat.ec.europa.eu/cache/ITY_SDDS/EN/org_esms.htm","label":"Eurostat: Organic farming (org)"},{"code":"http://epp.eurostat.ec.europa.eu/cache/ITY_SDDS/EN/tsdpc100_esmsip.htm","label":"Eurostat: Resource productivity (tsdpc100)"},{"code":"http://epp.eurostat.ec.europa.eu/cache/ITY_SDDS/EN/t2020_rl110_esmsip.htm","label":"Eurostat: Domestic material consumption - tonnes per capita (t2020_rl110)"}];
            $scope.options.licenses = [{ code: 'http://creativecommons.org/publicdomain/zero/1.0/', label: 'Creative Commons - CC0 Public Domain Dedication' }, { code: 'http://creativecommons.org/licenses/by/4.0/', label: 'Creative Commons - Attribution 4.0 International (CC BY 4.0)' }, { code: 'http://creativecommons.org/licenses/by-sa/4.0/', label: 'Creative Commons - Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)' }, { code: 'http://opendatacommons.org/licenses/pddl/', label: 'Open data commons - Public Domain Dedication and License (PDDL)' }, { code: 'http://opendatacommons.org/licenses/by/', label: 'Open data commons - Attribution License (ODC-By)' }, { code: 'http://opendatacommons.org/licenses/odbl/', label: 'Open data commons - Open Database License (ODC-ODbL)' }];

            //Remap dataset properties to simple array types e.g. ['a','v','c'], so the html controls can work with them
            for (var i in $scope.instance['rdf:RDF']['dcat:Dataset']) {
                $scope.InitDataset($scope.instance['rdf:RDF']['dcat:Dataset'][i]);
            }

            //Remap Indicator assessment properties to simple array types e.g. ['a','v','c'], so the html controls can work with them
            for (var i in $scope.instance['rdf:RDF']['sense:IndicatorAssessment']) {
                $scope.InitIndicatorAssessment($scope.instance['rdf:RDF']['sense:IndicatorAssessment'][i]);
            }

        } //InitDefaults()



    //Get option-formatted list of datasets, excluding the current if provided
    $scope.InitDataset = function(dataset) {

            //Existing dates must be instantiated as date-objects for them to be picked up by the datepicker as pre-selected.
            var issueDate = new Date(dataset['dct:issued']['$']);
            if (Object.prototype.toString.call(issueDate) === "[object Date]") { // it is a date
                if (!isNaN(issueDate.getTime())) { // date is valid
                    dataset['dct:issued']['$'] = issueDate;
                }
            }

            //theme(s) - convert to simple array
            $scope.ElementListToArray(dataset, 'dcat:theme');

            //subject(s) - convert to simple array
            $scope.ElementListToArray(dataset, 'dct:subject');

            //spatial - convert to simple array
            $scope.ElementListToArray(dataset, 'dct:spatial');

            //distributions - convert to simple array
            $scope.ElementListToArray(dataset, 'dcat:distribution');

            //source datasets - convert to simple array
            $scope.ElementListToArray(dataset, 'dct:source');

        } //InitDataset()


    $scope.InitIndicatorAssessment = function(indicatorAssessment) {

            //Existing dates must be instantiated as date-objects for them to be picked up by the datepicker as pre-selected.
            var issueDate = new Date(indicatorAssessment['dct:issued']['$']);
            if (Object.prototype.toString.call(issueDate) === "[object Date]") { // it is a date
                if (!isNaN(issueDate.getTime())) { // date is valid
                    indicatorAssessment['dct:issued']['$'] = issueDate;
                }
            }

            //closeMatch - convert to simple array
            $scope.ElementListToArray(indicatorAssessment, 'skos:closeMatch');

            //relatedMatch - convert to simple array
            $scope.ElementListToArray(indicatorAssessment, 'skos:relatedMatch');

            //Join SKOS matches to one property
            var allMatches = [];
            for (i in indicatorAssessment['skos:closeMatch']) {
                allMatches.push({
                    'matchType': 'closeMatch',
                    'matchUrl': indicatorAssessment['skos:closeMatch'][i]
                });
            }
            for (i in indicatorAssessment['skos:relatedMatch']) {
                allMatches.push({
                    'matchType': 'relatedMatch',
                    'matchUrl': indicatorAssessment['skos:relatedMatch'][i]
                });
            }
            if (allMatches.length < 1) {
                allMatches.push({
                    'matchType': '',
                    'matchUrl': ''
                });
            }
            indicatorAssessment['skos:matches'] = allMatches;

            //theme - convert to simple array
            $scope.ElementListToArray(indicatorAssessment, 'dcat:theme');

            //subject - convert to simple array
            $scope.ElementListToArray(indicatorAssessment, 'dct:subject');

            //spatial - convert to simple array
            $scope.ElementListToArray(indicatorAssessment, 'dct:spatial');

            //source dataset(s) - convert to simple array
            $scope.ElementListToArray(indicatorAssessment, 'dct:source');


        } //InitIndicatorAssessment()



    //Get option-formatted list of datasets, excluding the current if provided
    $scope.getDSOption = function(current) {
        var dsOptions = [];
        for (var i in $scope.instance['rdf:RDF']['dcat:Dataset']) {
            if ($scope.instance['rdf:RDF']['dcat:Dataset'][i]['@rdf:about'] !== current && $scope.instance['rdf:RDF']['dcat:Dataset'][i]['dct:title']) {
                dsOptions.push({
                    code: $scope.instance['rdf:RDF']['dcat:Dataset'][i]['@rdf:about'],
                    label: $scope.instance['rdf:RDF']['dcat:Dataset'][i]['dct:title']
                });
            }
        }
        return dsOptions;
    }

    //Get option-formatted list of distributions
    $scope.getDistributionOption = function() {
        var options = [];
        for (var i in $scope.instance['rdf:RDF']['dcat:Distribution']) {
            if ($scope.instance['rdf:RDF']['dcat:Distribution'][i]['dct:description']) {
                options.push({
                    code: $scope.instance['rdf:RDF']['dcat:Distribution'][i]['@rdf:about'],
                    label: $scope.instance['rdf:RDF']['dcat:Distribution'][i]['dct:description']
                });
            }
        }
        return options;
    }


    //Watch form for unsaved changes and if so prevent leaving the form without confirmation.
    $scope.$watch('appForm.$dirty', function(dirty) {
        if (dirty) {
            $rootScope.preventNavigation();
        } else {
            $rootScope.allowNavigation();
        }
    });



    //Save instance data for Save-button click
    $scope.saveInstance = function() {

        //Create a copy of the current instance, remap it and save it
        var instanceCopy = angular.copy($scope.instance);

        //Remap dataset arrays to DCAT-suitable json 
        var catalogDatasets = [];
        for (var i in instanceCopy['rdf:RDF']['dcat:Dataset']) {

            //theme - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['dcat:Dataset'][i], 'dcat:theme');

            //subject - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['dcat:Dataset'][i], 'dct:subject');

            //spatial - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['dcat:Dataset'][i], 'dct:spatial');

            //source - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['dcat:Dataset'][i], 'dct:source');

            //distribution - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['dcat:Dataset'][i], 'dcat:distribution');

            //add dataset to catalogue
            catalogDatasets.push({
                '@rdf:resource': instanceCopy['rdf:RDF']['dcat:Dataset'][i]['@rdf:about']
            });
        }


        //Remap Indicator assessment properties to rdf-suitable json 
        for (var i in instanceCopy['rdf:RDF']['sense:IndicatorAssessment']) {

            //theme - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i], 'dcat:theme');

            //subject - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i], 'dct:subject');

            //spatial - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i], 'dct:spatial');

            //source - convert to dcat-type array 
            $scope.ArrayToElementList(instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i], 'dct:source');


            //skos matches, split up one list into one for each type of match (match-element)
            var closeMatches = [];
            var relatedMatches = [];
            for (var j in instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:matches']) {
                if (instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:matches'][j].matchType === 'closeMatch') {
                    closeMatches.push({
                        '@rdf:resource': instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:matches'][j].matchUrl
                    });
                } else if (instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:matches'][j].matchType === 'relatedMatch') {
                    relatedMatches.push({
                        '@rdf:resource': instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:matches'][j].matchUrl
                    });
                }
            }
            instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:closeMatch'] = closeMatches;
            instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:relatedMatch'] = relatedMatches;
            if (instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:closeMatch'].length < 1) {
                instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:closeMatch'] = {
                    '@rdf:resource': ""
                };
            }
            if (instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:relatedMatch'].length < 1) {
                instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:relatedMatch'] = {
                    '@rdf:resource': ""
                };
            }
            delete instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['skos:matches']; //Remove placeholder before save

            //add indicator assessment to catalogue
            catalogDatasets.push({
                '@rdf:resource': instanceCopy['rdf:RDF']['sense:IndicatorAssessment'][i]['@rdf:about']
            });
        }

        //Add the list of datasets and indicator assessments to the catalogue
        instanceCopy['rdf:RDF']['dcat:Catalog']['dcat:dataset'] = catalogDatasets;

        dataRepository.saveInstance(instanceCopy).error(function(message) {
            alert("Failed to save the form data. Error message: " + message);
        }).success(function() {
            $scope.addAlert("Data is saved successfully.");
            $scope.appForm.$setPristine(true);
        });

    }


    //Convert array of type [{"@rdf:resource": "value"},{"@rdf:resource": "value"},...] to regular value array [{'value'},{'value'},..] for use in controls
    $scope.ElementListToArray = function(senseObject, elementName) {
        var tempArray = [];
        var propertyName = "@rdf:resource";
        if (angular.isDefined(senseObject[elementName][propertyName])) {
            //attribute is single value, save if not empty
            if (senseObject[elementName][propertyName]) {
                tempArray.push(senseObject[elementName][propertyName]);
            }
        } else {
            //attribute has multiple values, save all to new array
            for (var k in senseObject[elementName]) {
                if (senseObject[elementName][k][propertyName]) {
                    tempArray.push(senseObject[elementName][k][propertyName]);
                }
            }
        }
        senseObject[elementName] = tempArray;
    }


    //Convert regular value array [{'value'},{'value'},..] for use in controls to DCAT-suitable array [{"@rdf:resource": "value"},{"@rdf:resource": "value"},...]
    $scope.ArrayToElementList = function(senseObject, elementName) {
        var tempArray = [];
        for (var k in senseObject[elementName]) {
            if (senseObject[elementName][k]) {
                tempArray.push({
                    '@rdf:resource': senseObject[elementName][k]
                });
            }
        }
        senseObject[elementName] = tempArray;
        if (senseObject[elementName].length < 1) {
            senseObject[elementName] = {
                '@rdf:resource': ""
            };
        }
    }



    //Handle Close-button click
    $scope.close = function() {
        if ($scope.appForm.$dirty) {
            if (confirm('You have unsaved changes, do you want to continue?')) {
                //User chose to leave anyway, set form to not dirty to avoid a second question if OK to leave web form.
                $scope.appForm.$setPristine(true);
                window.location = 'http://' + window.location.host;
            }
        } else {
            window.location = 'http://' + window.location.host;
        }

    }

    //Handle Datepicker options and events
    $scope.datepicker = {};
    $scope.datepicker.pickerOpen = [];
    $scope.datepicker.config = {
        startingDay: 1
    };

    $scope.datepicker.open = function($event, datepickerSelected) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepicker.pickerOpen[datepickerSelected] = !$scope.datepicker.pickerOpen[datepickerSelected];
    };

    //Create arrays for repeating items
    $scope.initArray = function(arrayElement, last) {
        var tokens = arrayElement.split(".");
        var result = $scope.instance;
        while (tokens.length) {
            result = result[tokens.shift()];
        }
        if (!(result[last].length > 0)) {
            result[last] = [result[last]];
        }
    }

    //Add new (empty) skos-match row
    $scope.addMatchItem = function(skosMatches) {
        skosMatches.push({
            matchType: '',
            matchUrl: ''
        });
    }

    // Add new row to ng-repeat
    $scope.addItem = function(path) {
        var tokens = path.split(".");
        var result = $scope.instance;
        while (tokens.length) {
            result = result[tokens.shift()];
        }
        // Need to make copy of object otherwise it gets same $$hashkey and it cannot be used in ng-repeat.
        // Other solution would be to get empty instance every time that would be slower.
        var copyOfEmptyInstance = clone($scope.getInstanceByPath('emptyInstance', path));
        copyOfEmptyInstance['@rdf:about'] = createGuid();
        if (path === $scope.indicatorAssessmentPath) {
            $scope.InitIndicatorAssessment(copyOfEmptyInstance);
        } else if (path === $scope.datasetpath) {
            $scope.InitDataset(copyOfEmptyInstance);
        }
        result.push(copyOfEmptyInstance);
    }

    //Copy applicable properties from a selected dataset to a new IndicatorAssessment, and set the DS as its source
    $scope.copyDatasetAsIndicator = function(datasetIndex) {
        //Create the new IndicatorAssessment
        $scope.addItem("rdf:RDF.sense:IndicatorAssessment");
        //Get the dataset and indicator assessment objects and copy the properties
        var ia = $scope.instance['rdf:RDF']['sense:IndicatorAssessment'][$scope.instance['rdf:RDF']['sense:IndicatorAssessment'].length - 1];
        var ds = $scope.instance['rdf:RDF']['dcat:Dataset'][datasetIndex];
        ia['dct:title'] = ds['dct:title'];
        ia['dct:issued']['$'] = ds['dct:issued']['$'];
        ia['dcat:theme'] = ds['dcat:theme'];
        ia['dct:subject'] = ds['dct:subject'];
        ia['dct:spatial'] = ds['dct:spatial'];
        ia['dct:temporal'] = ds['dct:temporal'];
        //Set IA source to be the copied dataset
        ia['dct:source'].push(ds['@rdf:about']);
        $scope.addAlert('All relevant information from the dataset have now been copied to a new Indicator assessment (see the bottom of the form).');
        $scope.appForm.$setDirty(); //make sure the copied DS will be saved if if needed when exiting by closing the form
    }


    // Remove row from ng-repeat.
    $scope.removeItem = function(array, index, rowElement) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }
        array.splice(index, 1);
    }

    $scope.addAlert = function(message) {
        $scope.alerts.push({
            msg: message
        });
        $timeout(function() {
            $scope.alerts.splice($scope.alerts.indexOf(message), 1)
        }, 8000);

    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    $scope.getInstanceByPath = function(root, identifier) {
        if (!$scope.instance) {
            return null;
        }
        var tokens = root.split(".");
        var result = $scope;
        while (tokens.length) {
            result = result[tokens.shift()];
            if (!result) {
                return null;
            }
        }
        tokens = identifier.split(".");
        while (tokens.length) {
            result = result[tokens.shift()];
        }
        return result;
    }


});

//Get instance data and save instance data
//====================================================================================================================================
app.factory('dataRepository', function($http, $rootScope) {
    return {
        loadInstance: function() {
            var url = null;
            if (fileId) {
                url = baseUri + "/download/converted_user_file?fileId=" + fileId;
            } else {
                // testing on localhost
                url = "webtool-instance-empty.json";
            }
            return $http.get(url, {
                tracker: $rootScope.loadingTracker
            });
        },
        loadEmptyInstance: function() {
            var url = 'webtool-instance-empty.json';
            return $http.get(url, {
                tracker: $rootScope.loadingTracker
            });
        },
        saveInstance: function(data) {
            var url = baseUri + "/saveXml?fileId=" + fileId;
            fixUndefined(data);
            return $http.post(url, data, {
                tracker: $rootScope.loadingTracker
            });
        }
    }
});


//Helper functions
//====================================================================================================================================

// helper function for getting query string parameter values. AngularJS solution $location.search() doesn't work in IE8.
function getParameterByName(name) {
    var searchArr = window.location.search.split('?');
    var search = '?' + searchArr[searchArr.length - 1];
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//Sets 'undefined' to null
function fixUndefined(obj) {
    var isArray = obj instanceof Array;
    for (var j in obj) {
        if (obj.hasOwnProperty(j)) {
            if (typeof(obj[j]) == "object") {
                fixUndefined(obj[j]);
            } else if (!isArray && j != '$$hashkey') {
                if (typeof obj[j] == 'undefined') {
                    obj[j] = null;
                }
            }
        }
    }
}

//Clone
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) {
        return obj;
    }
    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//Generate id's for the items.
function createGuid() {
    return '#item-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}