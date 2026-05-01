(function (Drupal) {
  'use strict';


  function removeUntilReadyClasses(context) {
    var elements = context.querySelectorAll('[class*="-until-fapi-states-ready"]');

    Array.prototype.forEach.call(elements, function (element) {
      var classesToRemove = [];

      Array.prototype.forEach.call(element.classList, function (className) {
        if (/-until-fapi-states-ready$/.test(className)) {
          classesToRemove.push(className);
        }
      });

      if (classesToRemove.length) {
        element.classList.remove.apply(element.classList, classesToRemove);
      }
    });
  }

  function markReady(context) {
    removeUntilReadyClasses(context || document);
    document.documentElement.classList.remove('fapi-states-loading');
    document.documentElement.classList.add('fapi-states-ready');
  }

  function hasStateElements(context) {
    return (
      context.matches?.('[data-drupal-states]') ||
      !!context.querySelector('[data-drupal-states]')
    );
  }

  function afterStatesHaveRendered(callback) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(callback);
    });
  }

  Drupal.behaviors.fapiStatesReady = {
    attach: function (context) {
      if (!hasStateElements(context)) {
        return;
      }

      afterStatesHaveRendered(function () {
        markReady(context);
      });
    }
  };

})(Drupal);
