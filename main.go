package main

import (
	"embed"
	"krokis/internal/cmd"
	"krokis/internal/web"
)

//go:embed web/* web/components/*
var webFiles embed.FS

func main() {
	web.EmbeddedFiles = webFiles
	cmd.Execute()
}
