
def stock_wordcloud(stock_name):
    #https://medium.com/illumination/scraping-news-and-creating-a-word-cloud-in-python-10ea312c49ba
    import requests
    import urllib.request
    import time
    import spacy
    from bs4 import BeautifulSoup

    from flask import Flask, render_template, jsonify


    numResults=100
    url =f'https://www.google.com/search?q=stock+symbol+{stock_name}&tbm=nws&hl=en&num={str(numResults)}'
    # https://www.google.com/search?q=stock+symbol+AMZN&tbm=nws&hl=en&num=50

    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Get the links, headline and description text
    results = soup.find_all("div", attrs = {"class": "ZINbbc"})
    headlines = []
    descriptions = []
    links = []
    for result in results:
        try:
            headline = result.find("div", attrs={"class":"vvjwJb"}).get_text()
            if headline != "": 
                headlines.append(headline)
                links.append("google.com"+result.a["href"])
            description = result.find("div", attrs={"class":"s3v9rd"}).get_text()
            if description != "": 
                # remove the "1 day ago" etc.
                description = description[description.find("·")+1:]
                descriptions.append(description)
        except:
            continue
    # flattens string
    text_h = " ".join(headlines)
    text_p = " ".join(descriptions)
    text = text_h + text_p

    sp = spacy.load('en_core_web_sm')
    doc = sp(text)

    
    #Only allow valid tokens which are not stop words
    # and punctuation symbols.https://realpython.com/natural-language-processing-spacy-python/#word-frequency
    def is_token_allowed(token):
        if (not token or token.is_stop or token.is_punct):
            return False
        else:
            return True

    def preprocess_token(token):
        # Reduce token to its lowercase lemma form
        return token.lemma_.strip().lower()

    pos_dict={}
    for token in doc:
        if is_token_allowed(token):
            pos_dict[preprocess_token(token)]=token.pos_


            # Set up list of dictionaries with words, pos, counts
    from collections import Counter
    word_freq = Counter([token.lemma_.strip().lower() for token in doc if not token.is_stop and not token.is_punct])
    words = [{"Words": key, "POS": pos_dict[key], "Counts": word_freq[key]} for key in pos_dict.keys()]

    # Add headlines and links
    for item in words:
        item_headlines=[]
        item_links=[]
        for i in range(len(headlines)-1):
            if item["Words"] in descriptions[i].lower() or item["Words"] in headlines[i].lower():
                item_headlines.append(headlines[i])
                item_links.append(links[i])    
        item.update({"links": {"headline": item_headlines, "href": item_links}})
    
    # Send list to be jsonified
    return(words)