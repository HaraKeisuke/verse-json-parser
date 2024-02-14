Parse json to Verse struct.

```json
{
  "hoge": "fuga",
  "piyo": 1,
  "array_number": [1, 2, 3],
  "array_string": ["a", "b", "c"],
  "array_boolean": [true, false, true],
}
```


```verse
hoge_generated := struct:
    hoge :string= "fuga"
    piyo :int= 1
    array_number :[]int= array{1, 2, 3}
    array_string :[]string= array{"a", "b", "c"}
    array_boolean :[]logic= array{true, false, true}
```
