import { Suspense } from "react";

interface DynamicPageProps {
  params: Promise<{ id: string }>;
}

interface Todo {
  title: string;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  return (
    <Suspense fallback={<div>DynamicPageLoading...</div>}>
      <DynamicPageScreen params={params} />
    </Suspense>
  );
}

async function DynamicPageScreen({ params }: DynamicPageProps) {
  const { id } = await params;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
  );

  if (!response.ok) {
    throw new Error("할 일을 불러오지 못했어요.");
  }

  const todo: Todo = await response.json();

  return (
    <div>
      <h1>Todo {id}</h1>
      <p>{todo.title}</p>
    </div>
  );
}