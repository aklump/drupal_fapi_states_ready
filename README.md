# FAPI States Ready

## Summary

Adds temporary loading classes for Drupal forms that use FAPI `#states`, then removes those classes once states have had time to render.

This helps prevent users from seeing incorrect initial form state before Drupal’s states JavaScript has applied visibility, disabled, required, or other state-driven behavior.

## Install with Composer

Because this is an unpublished, custom Drupal extension, the way you install and depend on it is a little different than published, contributed extensions.

* Add the following to the **root-level** _composer.json_ in the `repositories` array:
    ```json
    {
     "type": "github",
     "url": "https://github.com/aklump/drupal_fapi_states_ready"
    }
    ```
* Add the installed directory to **root-level** _.gitignore_
  
   ```php
   /modules/contrib/fapi_states_ready/
   ```
* Proceed to either A or B, but not both.
---
### A. Install Standalone
* Require _fapi_states_ready_ at the **root-level**.
    ```
    composer require aklump_drupal/fapi_states_ready:^0.0
    ```
---
### B. Depend on This Extension

(_Replace `my_module` below with your module (or theme's) real name._)

* Add the following to _my_module/composer.json_ in the `repositories` array. (_Yes, this is done both here and at the root-level._)
    ```json
    {
     "type": "github",
     "url": "https://github.com/aklump/drupal_fapi_states_ready"
    }
    ```
* From the depending module (or theme) directory run:
    ```
    composer require aklump_drupal/fapi_states_ready:^0.0 --no-update
    ```

* Add the following to _my_module.info.yml_ in the `dependencies` array:
    ```yaml
    aklump_drupal:fapi_states_ready
    ```
* Back at the **root-level** run `composer update vendor/my_module`


---
### Enable This Extension

* Re-build Drupal caches, if necessary.
* Enable this extension, e.g.,
  ```shell
  drush pm-enable fapi_states_ready
  ```

## Quick Start

Add a `*-until-fapi-states-ready` class to temporarily mask an element until Drupal FAPI `#states` have rendered; the class is automatically removed once states are ready.

Add one of the provided classes to any FAPI element that should be treated as loading until states are ready.

```php
$form['my_element'] = [
  '#type' => 'container',
  '#attributes' => [
    'class' => ['invisible-until-fapi-states-ready'],
  ],
  '#states' => [
    'visible' => [
      ':input[name="toggle"]' => ['checked' => TRUE],
    ],
  ],
];
```

## Built-in Treatments

| Class | CSS behavior | Layout space reserved? |
|---|---:|---:|
| `invisible-until-fapi-states-ready` | `visibility: hidden` | Yes |
| `hidden-until-fapi-states-ready` | `display: none` | No |
| `disabled-until-fapi-states-ready` | `pointer-events: none; opacity: 0.6` | Yes |
| `faded-until-fapi-states-ready` | visual fade/blur | Yes |
| `shimmer-until-fapi-states-ready` | skeleton/loading shimmer | Yes |

## Examples

Add one of the provided classes to any FAPI element. When states are ready, the class is removed and normal styling resumes.

```php
$form['lookup'] = [
  '#type' => 'textfield',
  '#title' => t('Lookup value'),
  '#attributes' => [
    'class' => ['shimmer-until-fapi-states-ready'],
  ],
  '#states' => [
    'visible' => [
      ':input[name="enable_lookup"]' => ['checked' => TRUE],
    ],
  ],
];
```

## Extending

Any class ending with:

```text
-until-fapi-states-ready
```

will be removed when FAPI states are ready.

This lets developers create project-specific loading treatments without changing this module’s JavaScript.

Example custom treatment:

```css
.pulse-until-fapi-states-ready {
  opacity: 0.5;
  animation: my-project-pulse 1s ease-in-out infinite alternate;
}

@keyframes my-project-pulse {
  from {
    opacity: 0.35;
  }

  to {
    opacity: 0.75;
  }
}
```

Usage:

```php
$form['my_element']['#attributes']['class'][] = 'pulse-until-fapi-states-ready';
```

When states are ready, the class is removed and normal styling resumes.

## Theme Overrides

The shimmer treatment supports CSS custom properties.

```css
:root {
  --fapi-states-ready-shimmer-base: #f2f2f2;
  --fapi-states-ready-shimmer-highlight: #fafafa;
  --fapi-states-ready-shimmer-speed: 2s;
  --fapi-states-ready-shimmer-radius: 4px;
}
```

These can also be scoped to a component:

```css
.my-dark-panel {
  --fapi-states-ready-shimmer-base: #333;
  --fapi-states-ready-shimmer-highlight: #444;
}
```

## Behavior

1. Adds `fapi-states-loading` to `<html>` as early as possible.
2. Loads after Drupal’s states library.
3. Waits briefly for states-driven DOM changes to render.
4. Removes `fapi-states-loading` from `<html>`.
5. Adds `fapi-states-ready` to `<html>`.
6. Removes all classes ending with `-until-fapi-states-ready`.
