exports['go.mod updateContent updates dependencies 1'] = `
module example.com/hello/world

go 1.23.0

replace example.com/foo/bar => ../../foo/bar

require (
\texample.com/foo/bar 2.1.3
\texample.com/foo/baz v1.2.3
)

`