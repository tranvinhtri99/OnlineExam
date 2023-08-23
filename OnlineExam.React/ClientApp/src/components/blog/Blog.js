import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';

const mainFeaturedPost = {
  title: 'Online multiple choice exam',
  description:
    "Do the test and get the results quickly and accurately.",
  image: 'https://source.unsplash.com/random?education',
  imageText: 'main image description',
  linkText: '',
};

const featuredPosts = [
  {
    title: 'Join the contest now!!!',
    date: 'Nov 12',
    description:
      'The 1-hour, 15-minute test system is designed in the form of an online multiple-choice test.',
    image: 'https://source.unsplash.com/-hgJu2ykh4E',
    imageLabel: '',
  },
  {
    title: 'Instant Score View',
    date: 'Nov 11',
    description:
      'See the achievements now.',
    image: 'https://source.unsplash.com/jAebodq7oxk',
    imageLabel: '',
  },
];

const theme = createTheme();

export default function Blog() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
        </main>
      </Container>
    </ThemeProvider>
  );
}