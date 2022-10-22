import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import axios from "../axios";

export const FullPost = () => {
	const [data, setData] = React.useState();
	const [isLoading, setIsLoading] = React.useState(true)
	const {id} = useParams();
	React.useEffect(() => {
		axios.get(`/posts/${id}`).then(res => {
			setData(res.data)
			setIsLoading(false)
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении статьи')
		})
	}, [])

	if(isLoading) {
		return <Post isLoading={isLoading} isFullPost/>
	}
	console.log(data)
  return (
    <>
      <Post
        id={data.id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={{
			avatarUrl: data.user.avatarUrl ? `http://localhost:4444${data.user.avatarUrl}` : '', 
			fullName: data.user.fullName,
		  }}
		createdAt={moment(data.createdAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).format('DD-MM-YYYY HH:mm')}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost

      >
		<ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
