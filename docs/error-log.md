# Error Log

Every console error, browser warning, or lint failure gets a row here. Don't delete rows — the log is a record of how you got better.

| Date | Error message | File + line | My hypothesis | Fix | Blamed |
| ---- | ------------- | ----------- | ------------- | --- | ------ |
| 3/28/26 | 'breedResults' is never reassigned. Use 'const' instead | filters.js 29 | Issue is as stated | Changed let to const | Agent |
| 3/28/26 | 'speciesResults' is never reassigned. Use 'const' instead | filters.js 51 | Issue is as stated | Changed let to const | Agent |
| 4/7/26 | 'classes' is defined but never used | filters.js 2:10 | Unused import left after refactor | Removed unused import | Agent |
| 4/29/26 | 'getDrawerSelect' is defined but never used | app.js 19:3 | Helper function no longer referenced | Remove unused function | Agent |
| 4/29/26 | 'getCheckedInputs' is defined but never used | app.js 20:3 | Helper function no longer referenced | Remove unused function | Agent |
| 4/29/26 | 'event' is defined but never used | app.js 62:36 | Event handler parameter unused | Remove unused parameter | Agent |
| 4/29/26 | 'event' is defined but never used | app.js 95:33 | Event handler parameter unused | Remove unused parameter | Agent |
| 4/29/26 | 'event' is defined but never used | app.js 106:33 | Event handler parameter unused | Remove unused parameter | Agent |
| 4/29/26 | 'filterPets' is defined but never used | views.js 1:10 | Exported function not used in current app | Remove unused export or use it | Agent |
| 4/30/26 | Uncaught TypeError: Cannot read properties of null (reading: 'addEventListener') | app.js 214 | Query selector returned null because element isn't in DOM until after showDetail is called | Moved querySelector and event listener inside showDetail after the element is created | Me |
| 5/1/26 | 'innerHTML' is restricted from being used. Use createElement + textContent instead of innerHTML. | app.js 22, 159, 281 | Issue as stated, linter upgrade | Replace innerHTML with textContent | Agent |

Blamed: who or what introduced the error — you, the agent, or the starter code.
