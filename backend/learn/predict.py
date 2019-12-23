#!/usr/bin/env python
# coding: utf-8

# In[1]:


#ライブラリ

import numpy as np
import pandas as pd
from sklearn import svm
from sklearn.model_selection import GridSearchCV
import pickle


# In[2]:


#設定

TRAIN_FILE_NAME = "0_0_20000206014956JST_resample_All.csv"
TEST_FILE_NAME = "0_0_20191217132856JST_resample_All.csv"
MODEL_FILE_NAME = "model.binary"
PREDICT_FILE_NAME = "predict.json"
COLUMNS = ["AccX", "AccY", "AccZ", "GyroX", "GyroY", "GyroZ"]
MAX_TRACE = 10


# In[3]:


#0秒前〜(MAX_TRACE)秒前のデータを一列に並べる

df_test = pd.read_csv(TEST_FILE_NAME, index_col=0)
df_test = df_test.loc[:, COLUMNS]
df_test.columns = [col+"_0" for col in COLUMNS]

for i in range(MAX_TRACE):
    columns = [col+"_{}".format(i) for col in COLUMNS]
    new_columns = [col+"_{}".format(i+1) for col in COLUMNS]
    
    for column, new_column in zip(columns, new_columns):
        df_test.loc[:, new_column] = df_test.loc[:, column].rolling(2).sum() - df_test.loc[:, column]

df_test = df_test.tail(len(df_test)-MAX_TRACE)


# In[4]:


#分類結果を出力

X_test = df_test.values

with open(MODEL_FILE_NAME, "rb") as f:
    clf = pickle.load(f)

df_predict = pd.DataFrame(index = df_test.index)
df_predict.loc[:, "predict"] = clf.predict(X_test)
print(df_predict.to_json())


# In[ ]:




