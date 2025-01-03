
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context.js";
import { BOOKMARK_POST } from "../contexts/types.js";
import Navbar from "../components/Navbar.js";
import { axiosConfig, ALL_POST_URL, PROD_URL } from "../config/constants.js";
// Material-UI Components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// Material-UI Icons
import FavoriteIcon from "@material-ui/icons/Favorite.js";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder.js";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline.js";
import SendIcon from "@material-ui/icons/Send.js";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow.js";
import BookmarkIcon from "@material-ui/icons/Bookmark.js";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder.js";
import { formatDistanceToNow } from "date-fns";


// General style
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 500,
		margin: "20px auto",
		"& .MuiTextField-root": {
			width: "100%",
		},
		"& .MuiOutlinedInput-multiline": {
			paddingTop: "8px",
			paddingBottom: "8px",
			marginTop: "5px",
			marginLeft: "5px",
			marginRight: "5px",
		},
		"& .MuiCardContent-root:last-child": {
			paddingBottom: "10px",
		},
		"& .MuiDivider-middle": {
			marginBottom: "4px",
		},
		"& .MuiListItem-root": {
			padding: "0px 16px",
		},
		"& .MuiCardContent-root": {
			paddingTop: "0px",
			paddingBottom: "5px",
		},
		"& .MuiIconButton-root:focus": {
			backgroundColor: "rgba(0, 0, 0, 0)",
		},
	},
	header: {
		padding: "10px",
	},
	media: {
		//height: 0,
		paddingTop: "56.25%", // 16:9
		height: "max-content",
	},
	likeBar: {
		height: "25px",
		paddingTop: "0px",
		marginTop: "8px",
		marginLeft: "2px",
		paddingLeft: "0px",
		paddingBottom: "4px",
	},
	comments: {
		display: "flex",
		paddingTop: "0px",
		paddingLeft: "12px",
		paddingRight: "0px",
	},
	comment_item_see_more: {
		width: "35%",
		cursor: "pointer",
	},
	comments_icon_see_more: {
		height: "17px",
		width: "17px",
		paddingTop: "4px",
		paddingBottom: "3px",
	},
	comments_icon: {
		height: "30px",
		paddingLeft: "0px",
		paddingTop: "13px",
		paddingRight: "8px",
		paddingBottom: "0px",
	},
	inline: {
		display: "inline",
		fontWeight: "600",
	},
	avatar: {
		height: "40px",
	},
	links: {
		textDecoration: "none",
	},
}));

const Home = () => {
	const classes = useStyles();
	const { state, dispatch } = useContext(AuthenticationContext);

	const [data, setData] = useState([]);
	const [showSend, setShowSend] = useState(false);
	const [comment, setComment] = useState("");
	const [showAllComments, setShowAllComments] = useState({});

	// Modify your axios configuration to include the token
	const config = axiosConfig();

	useEffect(() => {
		axios.get(ALL_POST_URL, config).then((res) => {
			console.log("POST DATA", res.data.posts)
			setData(res.data.posts);
		});
	}, []);

	const likePost = (id) => {
		axios.put(`${PROD_URL}/like`, { postId: id }, config)
			.then((result) => {
				const newData = data.map((item) => {
					if (result.data._id === item._id) return result.data;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const unlikePost = (id) => {
		axios.put(`${PROD_URL}/Unlike`, { postId: id }, config)
			.then((res) => {
				const newData = data.map((item) => {
					if (res.data._id === item._id) return res.data;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const bookmark = (id) => {
		axios.put(`${PROD_URL}/bookmark-post`, { postId: id }, config)
			.then((result) => {
				console.log("result", result.data.bookmarks)
				dispatch({
					type: BOOKMARK_POST,
					payload: { bookmarks: result.data.bookmarks },
				});
				localStorage.setItem("user", JSON.stringify(result.data));
			})
			.catch((err) => console.log(err));
	};

	const removeBookmark = (id) => {
		axios.put(`${PROD_URL}/remove-bookmark`, { postId: id }, config)
			.then((result) => {
				dispatch({
					type: BOOKMARK_POST,
					payload: { bookmarks: result.data.bookmarks },
				});
				localStorage.setItem("user", JSON.stringify(result.data));
			})
			.catch((err) => console.log(err));
	};

	const makeComment = (text, postId) => {
		setComment("");
		axios.put(`${PROD_URL}/comment`, { text, postId }, config)
			.then((result) => {
				const newData = data.map((item) => {
					if (result.data._id === item._id) return result.data;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
		setComment("");
	};

	const deletePost = (postId) => {
		axios.delete(`${PROD_URL}/deletepost/${postId}`, config).then((res) => {
			const newData = data.filter((item) => {
				return item._id !== res.data;
			});
			setData(newData);
		});
	};

	console.log("data", data)
	console.log("state", state)

	return (
		<>
			<Navbar />
			{data.map((item) => (

				<div className="home" key={item._id}>
					<Card className={classes.root}>
						<CardHeader
							className={classes.header}
							avatar={
								<Avatar>
									<img
										className={classes.avatar}
										alt=""
										src={`data:${item.photoType};base64,${item.photo}`}
									/>
								</Avatar>
							}
							title={
								<Link
									className={classes.links}
									to={
										item.postedBy._id !== state.user._id
											? `/profile/${item.postedBy._id}`
											: "/profile"
									}
								>
									{item.postedBy.username}
								</Link>
							}
							subheader={formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
						/>

						<CardMedia
							className={classes.media}
							image={`data:${item.photoType};base64,${item.photo}`}
							title="Paella dish"
						/>

						<CardActions className={classes.likeBar} disableSpacing>
							{item.likes.includes(state.user._id) ? (
								<IconButton
									aria-label="Like"
									color="secondary"
									onClick={() => {
										unlikePost(item._id);
									}}
								>
									<FavoriteIcon />
								</IconButton>
							) : (
								<IconButton
									aria-label="Like"
									onClick={() => {
										likePost(item._id);
									}}
								>
									<FavoriteBorderIcon />
								</IconButton>
							)}
							<IconButton aria-label="comments">
								<ChatBubbleOutlineIcon />
							</IconButton>
							{state.user.bookmarks.includes(item._id) ? (
								<IconButton
									aria-label="Remove Bookmark"
									style={{ marginLeft: "auto", color: "#e0d011" }}
									onClick={() => {
										removeBookmark(item._id);
									}}
								>
									<BookmarkIcon />
								</IconButton>
							) : (
								<IconButton
									aria-label="Bookmark"
									style={{ marginLeft: "auto" }}
									onClick={() => {
										bookmark(item._id);
									}}
								>
									<BookmarkBorderIcon />
								</IconButton>
							)}
						</CardActions>

						<CardContent>
							<Typography variant="subtitle2" display="block" gutterBottom>
								{item.likes.length} likes
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								{item.body}
							</Typography>
						</CardContent>

						<Divider variant="middle" />

						<List>
							{item.comments.map((cmt, index) => {
								if (!showAllComments[item._id] && index >= 2) {
									return null;
								}
								return (
									<ListItem
										className={classes.comment_item}
										alignItems="flex-start"
										key={cmt._id}
									>
										<ListItemText
											secondary={
												<React.Fragment>
													<Typography
														component="span"
														variant="body2"
														className={classes.inline}
														color="textPrimary"
													>
														<Link
															className={classes.links}
															to={
																cmt.postedBy._id !== state.user._id
																	? `/profile/${cmt.postedBy._id}`
																	: "/profile"
															}
														>
															{cmt.postedBy.username}
														</Link>
													</Typography>
													{" — "}
													{cmt.text}
												</React.Fragment>
											}
										/>
									</ListItem>
								);
							})}
							{item.comments.length === 0 ? (
								<ListItem alignItems="flex-start" style={{ left: "38%" }}>
									<Typography variant="caption" display="block" gutterBottom>
										No comments yet
									</Typography>
								</ListItem>
							) : null}
							{item.comments.length > 2 && item.comments.length !== 0 ? (
								<ListItem
									alignItems="flex-start"
									className={classes.comment_item_see_more}
									onClick={() => {
										setShowAllComments((prevShowAllComments) => ({
											...prevShowAllComments,
											[item._id]: !prevShowAllComments[item._id],
										}));
									}}
								>
									<Typography variant="caption" display="block" gutterBottom>
										{showAllComments[item._id]
											? `Hide all comments`
											: `See all ${item.comments.length} comments`}
									</Typography>
									<DoubleArrowIcon className={classes.comments_icon_see_more} />
								</ListItem>
							) : null}
						</List>

						<Divider variant="middle" />

						<CardContent className={classes.comments}>
							<Avatar>
								<img
									className={classes.avatar}
									alt=""
									src="https://images.unsplash.com/photo-1537815749002-de6a533c64db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
								/>
							</Avatar>
							<TextField
								multiline
								rows={1}
								placeholder="Add your comment..."
								variant="outlined"
								value={comment}
								onChange={(event) => {
									event.preventDefault();
									setComment(event.target.value);
									setShowSend(true);
									if (event.target.value === "") setShowSend(false);
								}}
							/>
							<IconButton
								aria-label="add to favorites"
								className={classes.comments_icon}
								disabled={!showSend}
								onClick={() => makeComment(comment, item._id)}
							>
								<SendIcon />
							</IconButton>
						</CardContent>
					</Card>
				</div>
			))}
		</>
	);
};

export default Home;
