package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

type UpdatePostPayload struct {
	Title   *string `json:"title" validate:"omitempty,max=100"`
	Content *string `json:"content" validate:"omitempty,max=1000"`
}

func updatePost(postID int, p UpdatePostPayload, wg *sync.WaitGroup) {
	defer wg.Done()

	// Construct URL
	url := fmt.Sprintf("http://localhost:8080/v1/posts/%d", postID)

	b, _ := json.Marshal(p)

	req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(b))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Printf("Post %d updated. Status: %s\n", postID, resp.Status)
}

func main() {
	var wg sync.WaitGroup
	postID := 3

	// Two concurrent updates: title & content separately
	newTitle := "Updated Title"
	newContent := "Updated Content"

	wg.Add(2) // two goroutines

	go updatePost(postID, UpdatePostPayload{Content: &newContent}, &wg)
	// Update title only
	go updatePost(postID, UpdatePostPayload{Title: &newTitle}, &wg)

	// Update content only

	wg.Wait()
	fmt.Println("Both update requests finished")
}
