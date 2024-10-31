(function () {
    const arrayHasMatches = function (array, comp) {
        var ret = []
        for (var i in array) {
            if (comp.indexOf(array[i]) > -1) {
                ret.push(array[i])
            }
        }
        return ret.length
    }

    RegExp.quote = function (str) {
        return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
    }

    String.prototype.slugify = function () {
        return this.replace(/\s{1,}/g, ' ').replace(/[^\w\s]/gi, '').replace(/\W{1,}/g, '-').toLowerCase()
    }

    angular.module('menu', ['ngSanitize', 'ui.bootstrap'])

    //////////
    // Parent controller for all menus
    //////////
    angular.module('menu').config(function ($sceDelegateProvider, $anchorScrollProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://app.restaurant-logic.com/assets/**', 'http://localhost:9000/assets/**'])
        $anchorScrollProvider.disableAutoScrolling()
    }).controller('AngularMenuController', function ($scope, $timeout, $attrs, $http, $sce, $uibModal, $location, $anchorScroll) {

        // Instantiate search item
        $scope.search = {}
        $scope.search.searchItem = ''
        $scope.orgId = $attrs.organizationid
        $scope.menuDepth = $attrs.menudepth
        $scope.menuId = $attrs.menuid
        $scope.menuClasses = $attrs.menuclasses
        $scope.arrayHasMatches = arrayHasMatches

        // Instantiate menu
        $scope.menu = {
            tags: [], menus: []
        }

        // Determine if a section has visible items
        $scope.areMatches = function (subsection) {
            var curSearch = (!$scope.search ? '' : $scope.search.searchItem)
            return curSearch === '' || jQuery('#subsection-' + subsection.id + ' ul.subsection-item-list li.subsection-item:visible').length > 0
        }

        // Clear selected filters
        $scope.clearFilters = function () {
            $scope.menu.tags.forEach(function (t) {
                t.checked = false
            })
        }

        // Highlight text that matches the search item
        $scope.highlight = function (text, search) {
            new RegExp(RegExp.quote(search), 'gi')
            if (!search) {
                return $sce.trustAsHtml(text)
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class=\'highlightedText\'>$&</span>'
            ))
        }

        $scope.selectedTagIds = function () {
            return $scope.menu.tags.filter(function (t) {
                return t.checked
            }).map(function (t) {
                return t.id
            })
        }

        // Prepare URL for menu query based on 'Menu Depth' given on menu page
        var query
        switch ($scope.menuDepth) {
            // Section
            case 'section':
                query = 'https://api.restaurant-logic.com/api/MenuSections?filter={"include":[{"relation":"subsections","scope":{"include":[{"relation":"items","scope":{"include":[{"relation":"associated","scope":{"include":{"relation":"associatedItem","scope":{"where":{"deleted":false,"active":true},"include":[{"relation":"prices"},{"relation":"tags"}],"order":["position ASC"]}}}},{"relation":"prices"},{"relation":"tags"}],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"section","scope":{"fields":["organizationId"],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"featuredItems","scope":{"include":{"relation":"item","scope":{"where":{"deleted":false,"active":true}}}}}],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"featuredItems","scope":{"include":{"relation":"item","scope":{"where":{"deleted":false,"active":true}}}}}],"where":{"id":"' + $scope.menuId + '","deleted":false,"active":true},"order":["position ASC"]}'
                break
            // Subsection
            case 'subsection':
                query = 'https://api.restaurant-logic.com/api/MenuSubsections?filter={"include":[{"relation":"items","scope":{"include":[{"relation":"associated","scope":{"include":{"relation":"associatedItem","scope":{"where":{"deleted":false,"active":true},"include":[{"relation":"prices"},{"relation":"tags"}],"order":["position ASC"]}}}},{"relation":"prices"},{"relation":"tags"}],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"section","scope":{"fields":["organizationId"],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"featuredItems","scope":{"include":{"relation":"item","scope":{"where":{"deleted":false,"active":true}}}}}],"where":{"id":"' + $scope.menuId + '","deleted":false,"active":true},"order":["position ASC"]}'
                break
            // Full Menu and everything else
            default:
                query = 'https://api.restaurant-logic.com/api/MenuSections?filter={"include":[{"relation":"subsections","scope":{"include":[{"relation":"items","scope":{"include":[{"relation":"associated","scope":{"include":{"relation":"associatedItem","scope":{"where":{"deleted":false,"active":true},"include":[{"relation":"prices"},{"relation":"tags"}],"order":["position ASC"]}}}},{"relation":"prices"},{"relation":"tags"}],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"section","scope":{"fields":["organizationId"],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"featuredItems","scope":{"include":{"relation":"item","scope":{"where":{"deleted":false,"active":true}}}}}],"where":{"deleted":false,"active":true},"order":["position ASC"]}},{"relation":"featuredItems","scope":{"include":{"relation":"item","scope":{"where":{"deleted":false,"active":true}}}}}],"where":{"organizationId":"' + $scope.orgId + '","deleted":false,"active":true},"order":["position ASC"]}'
        }
        // Get the menu, as well as generate Tags map while we're at it
        $scope.menuPromise = $http.get(query)
        $scope.menuPromise.then(function (resp) {
            if ($scope.menuDepth === 'subsection') {
                $scope.menu.menus[0] = {}
                $scope.menu.menus[0].subsections = resp.data
                $scope.menu.menus[0].subsections.forEach(function (ss) {
                    ss.items.forEach(function (i) {
                        if (!i.tags) return
                        i.tagIds = i.tags.map(function (t) {
                            return t.id
                        })
                    })
                })
            }
            else {
                $scope.menu.menus = resp.data
                $scope.menu.menus.forEach(function (s) {
                    s.subsections.forEach(function (ss) {
                        ss.items.forEach(function (i) {
                            if (!i.tags) return
                            i.tagIds = i.tags.map(function (t) {
                                return t.id
                            })
                        })
                    })
                })
            }

            $timeout(function () {
                if (location.hash) {
                    if (angular.element('header').css('position') === 'fixed') {
                        $anchorScroll.yOffset = angular.element('header').height()
                    }
                    $anchorScroll(location.hash.replace('/', '').replace('#', ''))
                }
            }, 1000)
        })

        // Retrieve all tags for this Org ID
        $http.get('https://api.restaurant-logic.com/api/MenuTags?filter[where][organizationId]=' + $scope.orgId)
            .success(function (resp) {
                $scope.menu.tags = resp
            })

        $scope.open = function (aItem) {
            var modalInstance = $uibModal.open({
                templateUrl: 'https://app.restaurant-logic.com/assets/partials/menu/associated-item-modal.html',
                controller: function ($scope, $modalInstance, aItem) {
                    $scope.aItem = aItem

                    //when the close button is clicked
                    $scope.close = function () {
                        $modalInstance.close()
                    }
                },
                resolve: {
                    aItem: function () {
                        return aItem || {}
                    }
                }
            })
        }
    })


    angular.module('menu').filter('trustedHtml', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text)
        }
    }])

    /**********************************************************************************************************************/

//////////
// Child controller for the 'Collapsible' menu
//////////
    angular.module('menu').controller('AngularMenuControllerCollapsible', function ($scope, $timeout, $attrs, $http, $sce, $controller, $uibModal, $location, $anchorScroll) {
        angular.extend(this, $controller('AngularMenuController', {
            $scope: $scope,
            $timeout: $timeout,
            $attrs: $attrs,
            $http: $http,
            $sce: $sce,
            $uibModal: $uibModal,
            $location: $location,
            $anchorScroll: $anchorScroll
        }))
    })
    // Proper collapsing during search in "Collapsible" menu
        .directive('searchChange', function () {
            return {
                link: function (scope, element, attrs) {
                    scope.$watch(attrs.ngModel, function (v) {
                        var thisMenu = element.closest('.le-menu-classes')
                        if (v !== '') {
                            thisMenu.find('.subsection-item-list').slideDown()
                            thisMenu.find('.subsection').addClass('open')
                        } else {
                            thisMenu.find('.subsection-item-list').slideUp(function () {
                                thisMenu.find('.subsection').removeClass('open')
                            })
                        }
                    })
                }
            }
        })
        // Handle subsection toggling
        .directive('toggleCollapsibleSubsection', function () {
            return {
                link: function (scope, element) {
                    element.bind('click', function (e) {
                        e.preventDefault()

                        var subsection = element.parent('.subsection')
                        var itemList = element.siblings('.subsection-content').children('.subsection-item-list')

                        // If the clicked subsection was already visible...
                        if (itemList.is(':visible')) {
                            // ...just close this subsection
                            itemList.slideUp(function () {
                                itemList.css('display', '')
                                subsection.removeClass('open')
                            })
                        }
                        // Otherwise...
                        else {
                            // ...close all other subsections if there's no search active...
                            if (scope.search.searchItem === '') {
                                element.closest('.le-menu-classes').find('.subsection-item-list').not(itemList).each(function () {
                                    var thisList = jQuery(this)
                                    var thisSubsection = jQuery(this).parent().parent()
                                    thisList.slideUp(function () {
                                        thisList.css('display', '')
                                        thisSubsection.removeClass('open')
                                    })
                                })
                            }

                            // ...and open this subsection
                            itemList.slideDown(function () {
                                itemList.css('display', '')
                            })
                            subsection.addClass('open')
                        }
                    })
                }
            }
        })

    /**********************************************************************************************************************/

//////////
// Child controller for the 'Sidetabs' menu
//////////
    angular.module('menu').controller('AngularMenuControllerSidetabs', function ($scope, $timeout, $attrs, $http, $sce, $controller, $uibModal, $location, $anchorScroll) {
        angular.extend(this, $controller('AngularMenuController', {
            $scope: $scope,
            $timeout: $timeout,
            $attrs: $attrs,
            $http: $http,
            $sce: $sce,
            $uibModal: $uibModal,
            $location: $location,
            $anchorScroll: $anchorScroll
        }))
    })
    // Handle sidetab toggling
        .directive('toggleSidetab', function () {
            return {
                link: function (scope, element) {
                    element.bind('click', function (e) {
                        e.preventDefault()

                        var thisSection = element.closest('.section')
                        var linkedSubsectionContent = thisSection.find(element.data('rel'))

                        // If the clicked subsection is not visible...
                        if (linkedSubsectionContent.css('display') != 'block') {
                            // ...close all other subsections in this section...
                            thisSection.find(angular.element('.subsection-title').not(element)).removeClass('open')
                            thisSection.find(angular.element('.subsection-content').not(linkedSubsectionContent)).fadeOut(function () {
                                thisSection.find(angular.element('.subsection-content').not(linkedSubsectionContent)).removeClass('open')
                            })

                            // ...open the clicked subsection...
                            element.addClass('open')
                            linkedSubsectionContent.fadeIn(function () {
                                linkedSubsectionContent.addClass('open')
                            })

                            // ...and animate the height of the subsection content wrapper
                            linkedSubsectionContent.parent().animate({height: linkedSubsectionContent.outerHeight(true)}, 400)
                        }
                    })
                }
            }
        })
        // Directive for setting the '.subsection-content' tag's min-height
        .directive('setContentMinHeight', function ($timeout) {
            return {
                link: function (scope, elem) {
                    scope.menuPromise.then(function () {
                        $timeout(function () {
                            elem.css('min-height', elem.siblings('.subsection-title-list').height() + 'px')
                        })
                    })
                    setInterval(function () {
                        if (elem.is(':visible')) {
                            elem.css('min-height', elem.siblings('.subsection-title-list').height() + 'px')
                            elem.css('height', elem.siblings('.subsection-content-space').height() + 'px')
                        }
                    }, 500)
                }
            }
        })
        // Directive for setting the '.section-sortable' tag's min-height
        .directive('clickFirstTitle', function ($timeout) {
            return {
                link: function (scope, elem) {
                    $timeout(function () {
                        elem.children('.subsection-title:first-child').click()
                    })
                }
            }
        })

    /**********************************************************************************************************************/

//////////
// Child controller for the 'Vexillology' menu
//////////
    angular.module('menu').controller('AngularMenuControllerVexillology', function ($scope, $timeout, $attrs, $http, $sce, $controller, $uibModal, $location, $anchorScroll) {
        angular.extend(this, $controller('AngularMenuController', {
            $scope: $scope,
            $timeout: $timeout,
            $attrs: $attrs,
            $http: $http,
            $sce: $sce,
            $uibModal: $uibModal,
            $location: $location,
            $anchorScroll: $anchorScroll
        }))
    })
    // Directive for setting the '.subsection-title' tag's position
        .directive('rotateHeader', function ($timeout) {
            return {
                link: function (scope, elem) {
                    $timeout(function () {
                        elem.css({'bottom': 'auto', 'top': elem.css('width')})
                        elem.siblings('.subsection-content').css('min-height', elem.css('width'))
                    })
                }
            }
        })

    /**********************************************************************************************************************/

//////////
// Child controller for the 'Gridlock' menu
//////////
    angular.module('menu').controller('AngularMenuControllerGridlock', function ($scope, $timeout, $attrs, $http, $sce, $controller, $uibModal, $location, $anchorScroll) {
        angular.extend(this, $controller('AngularMenuController', {
            $scope: $scope,
            $timeout: $timeout,
            $attrs: $attrs,
            $http: $http,
            $sce: $sce,
            $uibModal: $uibModal,
            $location: $location,
            $anchorScroll: $anchorScroll
        }))

        function chunkArray(array, size) {
            var newArray = []
            for (var i = 0; i < array.length; i += size) {
                newArray.push(array.slice(i, i + size))
            }

            return newArray
        }

        $scope.menuPromise.then(function () {
            $scope.chunkedSubsections = []
            for (var i = 0; i < $scope.menu.menus.length; i++) {
                if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
                    $scope.chunkedSubsections.push(chunkArray($scope.menu.menus[i].subsections, 1))
                } else {
                    $scope.chunkedSubsections.push(chunkArray($scope.menu.menus[i].subsections, 3))
                }
            }
        })
    })
    // Handle subsection toggling
        .directive('toggleGridlockSubsection', function () {
            return {
                link: function (scope, element) {
                    element.bind('click', function (e) {
                        e.preventDefault()

                        var thisMenu = element.closest('.le-menu-classes')
                        var subsectionContent = thisMenu.find(element.data('rel'))

                        // If the clicked subsection was already visible...
                        if (subsectionContent.is(':visible')) {
                            // ...just close this subsection
                            subsectionContent.slideUp(function () {
                                subsectionContent.css('display', '')
                                subsectionContent.removeClass('open')
                            })
                            element.removeClass('open')
                        }
                        // Otherwise...
                        else {
                            // ...close all other subsections...
                            thisMenu.find('.subsection').not(element).each(function () {
                                var thisSubsection = angular.element(this)
                                var thisSubsectionContent = thisMenu.find(thisSubsection.data('rel'))
                                thisSubsectionContent.slideUp(function () {
                                    thisSubsectionContent.css('display', '')
                                    thisSubsectionContent.removeClass('open')
                                })
                                thisSubsection.removeClass('open')
                            })

                            // ...and open this subsection
                            subsectionContent.slideDown(function () {
                                subsectionContent.css('display', '')
                            })
                            element.addClass('open')
                            subsectionContent.addClass('open')
                        }
                    })
                }
            }
        })

    /**********************************************************************************************************************/

    //////////
    // Child controller for the 'Descent' menu
    //////////
    angular.module('menu').controller('AngularMenuControllerDescent', function ($scope, $timeout, $attrs, $http, $sce, $controller, $uibModal, $location, $anchorScroll) {
        angular.extend(this, $controller('AngularMenuController', {
            $scope: $scope,
            $timeout: $timeout,
            $attrs: $attrs,
            $http: $http,
            $sce: $sce,
            $uibModal: $uibModal,
            $location: $location,
            $anchorScroll: $anchorScroll
        }))

        $scope.headerAdjust = angular.element('header').css('position') === 'fixed' ? angular.element('header').height() : 0
    })
    // Directive for scrolling to a specific subsection
        .directive('clickScroll', function () {
            return {
                link: function ($scope, elem) {
                    elem.bind('click', function (e) {
                        e.preventDefault()

                        var body = angular.element(document).find('html,body')
                        if (!body.is(':animated')) {
                            body.animate({scrollTop: angular.element(elem.data('rel')).offset().top - $scope.headerAdjust}, 'slow')
                        }
                    })
                }
            }
        })
        // Directive for setting the '.elevator-nav' tag's width
        .directive('setNavWidth', function ($timeout) {
            return {
                link: function (scope, elem) {
                    $timeout(function () {
                        elem.css('width', elem.parent().innerWidth() + 'px')
                    }, 1000)
                }
            }
        })
        // Directive for sticking the '.elevator-nav' tag if we've scrolled down enough
        .directive('stickNav', function ($window) {
            return function ($scope, elem, attrs) {
                angular.element($window).bind('scroll', function () {
                    $scope.isCoveringFooter = $window.pageYOffset + angular.element('.elevator-nav').outerHeight(false) + $scope.headerAdjust >= angular.element('footer').offset().top
                    $scope.isStuck = !$scope.isCoveringFooter && $window.pageYOffset + $scope.headerAdjust > elem.offset().top

                    if ($scope.isStuck) {
                        angular.element('.stuck').css('top', $scope.headerAdjust + 'px')
                    }

                    $scope.$apply()
                })
            }
        })
        // Directive for highlighting the '.subsection-list-title' if the window is in view of it
        .directive('checkForHighlight', function ($window) {
            return function ($scope, elem, attrs) {
                angular.element($window).bind('scroll', function () {
                    var docHeight = jQuery(document).height()
                    var windowTop = $window.pageYOffset + $scope.headerAdjust
                    var windowHeight = $window.innerHeight
                    var div = angular.element(elem.data('rel'))
                    var divTop = div.offset().top
                    var divHeight = div.outerHeight(false)

                    $scope.isHighlighted =
                        windowTop >= divTop &&
                        windowTop < (divTop + divHeight) &&
                        (windowTop + windowHeight) < docHeight

                    if ($scope.$last && (windowTop + windowHeight) >= docHeight && jQuery(elem).is('.section-list-title:last-child .subsection-list-title:last-child')) {
                        $scope.isHighlighted = true
                    }

                    $scope.$apply()
                })
            }
        })
})()
