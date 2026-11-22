import { ManagedPostList } from '@/components/posts/ManagedPostList';
export default async function PostsPage({searchParams}:{searchParams:Promise<{page?:string;state?:string;q?:string}>}) {return <ManagedPostList mode="active" search={await searchParams}/>;}
