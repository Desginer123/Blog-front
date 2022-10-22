import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import {useSelector} from "react-redux";
import {Navigate, useParams, useNavigate} from "react-router-dom";
import {selectIsAuth} from "../../redux/slices/auth";
import axios from '../../axios'
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
	
	const {id} = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const [text, setText] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [tags, setTags] = React.useState("");
	const [imageUrl, setImageUrl] = React.useState("");
	const [loading, setLoading] = React.useState(false)
	const inputFileRef = React.useRef(null)
	const isEditing = Boolean(id);
	const onSubmit = async () => {
		try {
			setLoading(true)
		
			const fields = {
				title,
				imageUrl,
				tags,
				text
					
			}
			
			const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields)
			
			const _id = isEditing ? id : data._id
			
			navigate(`/posts/${_id}`)
			
			
			
		} catch (err) {
			console.warn(err)
			alert('Ошибка при создании статьи')
		}
	}
	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);
	React.useEffect(() => {
		if(id) {
			axios.get(`posts/${id}`).then(({data}) => {
				setTitle(data.title)
				setText(data.text)
				setImageUrl(data.imageUrl);
				setTags(data.tags.join(','))
			})
		}
	}, [])
	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Введите текст...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);
	if (!window.localStorage.getItem("token") && !isAuth) {
		return <Navigate to="/login" />;
	}
	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0]
			formData.append('image', file)
			const {data} = await axios.post('/upload', formData);
			setImageUrl(data.url)
		} catch(err) {
			console.warn(err)
			alert('Ошибка при загрузке файла!')
		}
	}
	const onClickRemoveImage = async (event) => {
		setImageUrl('');
	}
	return (
		<Paper elevation={0} style={{padding: 30}}>
			<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
				Загрузить превью
			</Button>
			<input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button variant='contained' color='error' onClick={onClickRemoveImage}>Удалить</Button>
					<img className={styles.image} src ={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt='Uploaded'/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{root: styles.title}}
				variant="standard"
				placeholder="Заголовок статьи..."
				fullWidth
				value={title}
				onChange={(e) => {setTitle(e.target.value)}}
			/>
			<TextField
				classes={{root: styles.tags}}
				variant="standard"
				placeholder="Тэги"
				fullWidth
				value={tags}
				onChange={(e) => {setTags(e.target.value)}}
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
				{isEditing === true ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<Button size="large">Отмена</Button>
			</div>
		</Paper>
	);
};
