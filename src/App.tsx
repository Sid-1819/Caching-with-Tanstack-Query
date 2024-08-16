import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
  body: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}




function App() {

  const queryClient= useQueryClient();

  const { data, isLoading} = useQuery<Todo[]>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((response) =>
        response.json()
      ),
     //refetchInterval:20000
  });

  const { mutate, isPending,isError} = useMutation({
    mutationFn: (newPost:Post) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers:{"Content-type": "application/json; charset=UTF-8"}
      }).then((response) => response.json()),
      onSuccess:(newPost) =>{
        // queryClient.setQueryData
        queryClient.setQueryData<Post[]>(["posts"],(oldPosts=[]) =>[...oldPosts,newPost])
      }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if(isError){
    return <div>An error occured</div>
  }

  return (
    <div>
     {isPending && <p>DATA IS BEING ADDED</p>}
      <button
      disabled={isPending}
        onClick={() =>
          mutate({
            userId: 1999,
            id: 1999,
            title:
              "This is Siddhesh Shirdhankar",
            body: "It's Aug 16, 2024",
          })
        }
      >
        Add Post
      </button>
      Hello{" "}
      {data.map((todo) => (
        <div key={todo.id}>
          {" "}
          <div className="text-lg">{todo.id}</div>
          <div className="text-sm">TITLE: {todo.title}</div>
          <p>{todo.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
