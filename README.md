#What
This rule can be used instead of eslint's `space-in-parens`, `space-in-brackets` and `array-bracket-spacing`
It makes sure the code has at least one space around `(` `{` and `[`

`func(a)` will fix to `func( a )`
`func (a)` is valid
`func({a : 'x'})` will fix to `func({ a : 'x' })`

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
 