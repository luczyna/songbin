import { SongbinPage } from './app.po';

describe('songbin App', () => {
  let page: SongbinPage;

  beforeEach(() => {
    page = new SongbinPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
