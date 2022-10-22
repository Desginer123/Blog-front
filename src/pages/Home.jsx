import React from "react";
import Tabs from "@mui/material/Tabs";
import {useDispatch, useSelector} from 'react-redux'
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import moment from 'moment'
import {Post} from "../components/Post";
import {TagsBlock} from "../components/TagsBlock";
import {CommentsBlock} from "../components/CommentsBlock";
import { fetchPosts, fetchTags, fetchPopularPosts } from "../redux/slices/posts";
import {fetchComments} from '../redux/slices/comments'
export const Home = () => {
	const dispatch = useDispatch()
	React.useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchPopularPosts())
		dispatch(fetchTags())
		dispatch(fetchComments())
	}, [])
	const {posts, popularPosts, tags} = useSelector((state) => state.posts)
	const {comments} = useSelector((state) => state.comments)
	const [currentSort, setCurrentSort] = React.useState(0)
	const userData = useSelector((state) => state.auth.data)
	const isPostsLoading = posts.status === 'loading'
	const isCommentsLoading = comments.status === 'loading'

	const isPopularPostsLoading = popularPosts.status === 'loading'

	const isTagsLoading = tags.status === 'loading'

	return (
		<>
			<Tabs
				style={{marginBottom: 15}}
				value={currentSort}
				aria-label="basic tabs example">
				<Tab onClick={() => setCurrentSort(0)} label="Новые" />
				<Tab onClick={() => setCurrentSort(1)} label="Популярные" />
			</Tabs>
			<Grid container spacing={4}>
				{currentSort > 0 ? 
				<Grid xs={8} item>
				{(isPopularPostsLoading ? [...Array(5)] : popularPosts.items).map((obj, index) => 
				isPopularPostsLoading ? (
					<Post key={index} isLoading={true}/>
				) : (
					(
						<Post
							id={obj._id}
							title={obj.title}
							// imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
							imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
							user={{
								avatarUrl: obj.user.avatarUrl ? `http://localhost:4444${obj.user.avatarUrl}` : '', 
								fullName: obj.user.fullName,
							  }}
							createdAt={moment(obj.createdAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).format('DD-MM-YYYY HH:mm')}
							viewsCount={obj.viewsCount}
							commentsCount={3}
							key={index}
							tags={obj.tags }
							isEditable={userData?._id === obj.user._id}
							
						/>
					)
				)
				)}
				</Grid> : 
				<Grid xs={8} item>
				{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => 
				isPostsLoading ? (
					<Post key={index} isLoading={true}/>
				) : (
					(
						<Post
							id={obj._id}
							title={obj.title}
							// imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
							imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
							user={{
								avatarUrl: obj.user.avatarUrl ? `http://localhost:4444${obj.user.avatarUrl}` : '', 
								fullName: obj.user.fullName,
							  }}
							createdAt={moment(obj.createdAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).format('DD-MM-YYYY HH:mm')}
							viewsCount={obj.viewsCount}
							commentsCount={3}
							key={index}
							tags={obj.tags }

							isEditable={userData?._id === obj.user._id}
							
						/>
					)
				)
				)}
			</Grid>	
				}
				<Grid xs={4} item>
					<TagsBlock
						items={tags.items}
						isLoading={isTagsLoading}
					/>
					<CommentsBlock
						items={comments.items}
						isLoading={isCommentsLoading}
					/>
				</Grid>
			</Grid>
		</>
	);
};
