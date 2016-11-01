#What
This rule can be used instead of eslint's `space-in-parens`, `space-in-brackets` and `array-bracket-spacing`
It makes sure the code has at least one space around `(` `{` and `[`
Works in symbiosys with the rules `space-before-function-paren`, `func-call-spacing`

`func(a)` will fix to `func( a )`
`func (a)` is valid
`func({a : 'x'})` will fix to `func({ a : 'x' })`

###Options
- `loose` 
Don't force the removal space between parens curly bracket `loose : ['()']`
`( (x=foo) )` is valid
This option don't create additional constraint but just delete some

- `inside`
Force the spaces to be inside the punctuators `inside : ['{}']`
`a = { x }` is valid
`a({ x })` is valid


#Install


#Developpement
To install in the project you want to use the rule in
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
 