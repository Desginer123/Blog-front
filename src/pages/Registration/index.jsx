import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import styles from "./Login.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom/dist";
import {useForm} from "react-hook-form";
import axios from "../../axios";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const [formError, setFormError] = React.useState(false);
	const [image, setImage] = React.useState("");
	const inputFileRef = React.useRef(null);
	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append("image", file);
			const {data} = await axios.post("/uploadAvatar", formData);
			setImage(data.url);
		} catch (err) {
			console.warn(err);
			alert("Ошибка при загрузке файла!");
		}
	};
	const handleRemoveFile = () => {
		setImage("");
	};
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: {errors, isValid},
	} = useForm({
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			avatarUrl: image
		},
		mode: 'onChange'
	});
	const onSubmit = async (values) => {
		values.avatarUrl = image;
		console.log(values)
		const data = await dispatch(fetchRegister(values));
		if (!data.payload) {
			return setFormError(true);
		}
		if ("token" in data.payload) {
			window.localStorage.setItem("token", data.payload.token);
		}
	};
	if (isAuth) {
		return <Navigate to="/" />;
	}
	return (
		<Paper elevation={0} classes={{root: styles.root}}>
			<Typography classes={{root: styles.title}} variant="h5">
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar
					src={image ? `${process.env.REACT_APP_API_URL}${image}` : ""}
					sx={{width: 100, height: 100}}
				/>
			</div>
			

			<form onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.buttons_wrapper}>
				{!image && (
					<>
						<Button
							onClick={() => inputFileRef.current.click()}
							variant="outlined"
							size="large">
							Выбрать аватар
						</Button>{" "}
					</>
				)}

				<input
					{...register("avatarUrl")}
					hidden
					ref={inputFileRef}
					type="file"
					onChange={handleChangeFile}
				/>
				{image && (
					<>
						<Button
							variant="contained"
							color="error"
							onClick={handleRemoveFile}>
							Удалить
						</Button>
					</>
				)}
			</div>
				<TextField
					{...register("fullName", {required: "Укажите имя"})}
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					className={styles.field}
					label="Полное имя"
					fullWidth
				/>
				<TextField
					{...register("email", {required: "Укажите почту"})}
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					className={styles.field}
					label="E-Mail"
					fullWidth
				/>
				<TextField
					{...register("password", {required: "Укажите пароль"})}
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					className={styles.field}
					label="Пароль"
					type="password"
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth>
					Зарегистрироваться
				</Button>
				{formError && (
					<p className="css-1wc848c-MuiFormHelperText-root Mui-error ss-1wc848c-MuiFormHelperText-root">
						Ошибка регистрации
					</p>
				)}
			</form>
		</Paper>
	);
};
