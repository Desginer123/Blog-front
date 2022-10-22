import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import moment from 'moment'
import {Post} from "../components/Post";
import {TagsBlock} from "../components/TagsBlock";
import {CommentsBlock} from "../components/CommentsBlock";
import {fetchPostsByTag, fetchTags} from "../redux/slices/posts";
export const TagPage = () => {
	const dispatch = useDispatch()
	const {tag} = useParams()
	React.useEffect(() => {
		dispatch(fetchPostsByTag(tag.replace(/\s/g, "")))
		dispatch(fetchTags())
	}, [tag])
	const {postsByTag, tags} = useSelector((state) => state.posts)
	const userData = useSelector((state) => state.auth.data)
	const isPostsLoading = postsByTag.status === 'loading'
	const isTagsLoading = tags.status === 'loading'
	return (
		<>
			<h1>Записи по тэгу: {tag}</h1>
			<Grid container spacing={4}>
				<Grid xs={8} item>
				{(isPostsLoading ? [...Array(5)] : postsByTag.items).map((obj, index) => 
				isPostsLoading ? (
					<Post key={index} isLoading={true}/>
				) : (
					(
					<Post
						id={obj._id}
						title={obj.title}
						// imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
						imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
						user={{
							avatarUrl: obj.user.avatarUrl ? `${process.env.REACT_APP_API_URL}${obj.user.avatarUrl}` : '', 
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
				<Grid xs={4} item>
					<TagsBlock
						items={tags.items}
						isLoading={isTagsLoading}
					/>
					<CommentsBlock
						items={[
							{
								user: {
									fullName: "Вася Пупкин",
									avatarUrl:
										"https://mui.com/static/images/avatar/1.jpg",
								},
								text: "Это тестовый комментарий",
							},
							{
								user: {
									fullName: "Иван Иванов",
									avatarUrl:
										"https://mui.com/static/images/avatar/2.jpg",
								},
								text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	);
};
