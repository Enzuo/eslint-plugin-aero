## What
This is an additional rule for eslint [http://eslint.org/]()

It can be used **instead** of eslint's `space-in-parens`, `space-in-brackets` and `array-bracket-spacing`

It makes sure the code has at least one space around `(` `{` and `[` without enforcing the space to be on the left or the right

Works in **symbiosys** with the rules `space-before-function-paren` and `func-call-spacing`

- `func(a)` will be fixed to `func( a )`
- `func (a)` is valid
- `func({a : 'x'})` will be fixed to `func({ a : 'x' })`

## Options
- `"loose"`
Don't force the removal space between parens curly bracket `loose : ['()']`
`( (x=foo) )` is valid
This option don't create additional constraint but just delete some

- `"inside"`
Force the spaces to be inside the punctuators `inside : ['{}']`
`a = { x }` is valid
`a({ x })` is valid


## Install


### Developpement
To install this rule, run in your project : 
`npm install -S ./eslint-plugin-aero`

then in .eslintrc.json
```
"plugins": [
    "eslint-plugin-aero"
],
"rules": {
    "eslint-plugin-aero/aero": "warn"
}
```
 