import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});
export const fetchPopularPosts = createAsyncThunk('posts/fetchPopularPosts', async () => {
	const { data } = await axios.get('/popularPosts');
	return data;
  });

export const fetchPostsByTag = createAsyncThunk('posts/fetchPostsByTag', async (tag) => {
const { data } = await axios.get(`/postsByTag/${tag}`);
return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/tags');
  	return data;
})
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
	axios.delete(`/posts/${id}`);
  	return id;
})


const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
  popularPosts: {
	items: [],
	status: ''
  },
  postsByTag: {
	items: [],
	status: ''
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
	// удаление статьи
	[fetchRemovePost.pending]: (state, action) => {
		state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg)
		state.popularPosts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg)
	},
    // Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

	// получение статьей по тегу
	[fetchPostsByTag.pending]: (state) => {
		state.postsByTag.items = [];
		state.postsByTag.status = 'loading';
	},
	[fetchPostsByTag.fulfilled]: (state, action) => {
	state.postsByTag.items = action.payload;
	state.postsByTag.status = 'loaded';
	},
	[fetchPostsByTag.rejected]: (state) => {
	state.postsByTag.items = [];
	state.postsByTag.status = 'error';
	},
	// получение статьи по популярности
	[fetchPopularPosts.pending]: (state) => {
      state.popularPosts.items = [];
      state.popularPosts.status = 'loading';
    },
    [fetchPopularPosts.fulfilled]: (state, action) => {
      state.popularPosts.items = action.payload;
      state.popularPosts.status = 'loaded';
    },
    [fetchPopularPosts.rejected]: (state) => {
      state.popularPosts.items = [];
      state.popularPosts.status = 'error';
    },
	// Получние тегов 
	[fetchTags.pending]: (state) => {
		state.tags.items = [];
		state.tags.status = 'loading';
	},
	[fetchTags.fulfilled]: (state, action) => {
	state.tags.items = action.payload;
	state.tags.status = 'loaded';
	},
	[fetchTags.rejected]: (state) => {
	state.tags.items = [];
	state.tags.status = 'error';
	},

	
	
  },
});

export const postsReducer = postsSlice.reducer;	