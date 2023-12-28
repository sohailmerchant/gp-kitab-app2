import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import React, { useContext } from "react";

import { CSVLink } from "react-csv";
import { Context } from "../../../App";

const DownloadData = ({ data, status }) => {
  const { checkedBooks } = useContext(Context);

  const specificData =
    checkedBooks.length !== 0
      ? checkedBooks
      : data.map((item) => {
          const dataObject = {
            id: item?.id,
            release_code: item?.release_version?.release_code,
            release_date: item?.release_version?.release_date,
            version_code: item?.version_code,
            version_uri: item?.version_uri,
            pdf_url: item?.edition?.pdf_url,
            language: item?.language,
            analysis_priority: item?.release_version?.analysis_priority,
            annotation_status: item?.release_version?.annotation_status,
            token_length: item?.release_version?.tok_length,
            char_length: item?.release_version?.char_length,
            url: item?.release_version?.url,
            text_tags: item?.text?.tags,
            text_uri: item?.text?.text_uri,
            title_ar_prefered: item?.text?.title_ar_prefered,
            title_lat_prefered: item?.text?.title_lat_prefered,
            author_uri: item?.text?.author[0]?.author_uri,
            author_ar_prefered: item?.text?.author[0]?.author_ar_prefered,
            author_lat_prefered: item?.text?.author[0]?.author_lat_prefered,
            author_date_AH: item?.text?.author[0]?.date_AH,
            author_date_CE: item?.text?.author[0]?.date_CE,
          };
          return dataObject;
        });

  return (
    <Tooltip 
      title={(checkedBooks.length > 0) ? "Download selected metadata in csv format" : "Download metadata on this page in csv format"}
      placement="top"
    >
      <span>
        {status === "loading" ? (
          <IconButton size="large" variant="text" sx={{ fontSize: "15px" }}>
            <CircularProgress size={"15px"} sx={{ color: "green" }} />
          </IconButton>
        ) : (
          specificData.length !== 0 && (
            <CSVLink
              data={specificData}
              filename="kitabapps_data.csv"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                color: "#6b7280",
              }}
            >
              <IconButton size="large" variant="text" sx={{ fontSize: "15px" }}>
                <i
                  className="fa-solid fa-file-csv"
                  style={{ color: "#2863A5" }}
                ></i>
              </IconButton>
            </CSVLink>
          )
        )}
      </span>
    </Tooltip>
  );
};

export default DownloadData;
