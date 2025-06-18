import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  formatTimeString,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../utils/helpers";
import { useSelector } from "react-redux";

const ScrollableChat = ({ messages }) => {
  const { userInfo } = useSelector((store) => store.auth);

  return (
    <div>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{ display: "flex", alignItems: "center", gap: 3 }}
            key={m._id}
          >
            {isSameSender(messages, m, i, userInfo._id) ||
              (isLastMessage(messages, i, userInfo._id) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    size="sm"
                    name={m.sender.name}
                    src={m.sender.profilePicture}
                  />
                </Tooltip>
              ))}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === userInfo._id ? "#20B46A" : "#161C23"
                }`,
                color: `${m.sender._id === userInfo._id ? "#000" : "#fff"}`,
                padding: "5px 15px",
                borderRadius: "20px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, userInfo._id),
                marginTop: isSameUser(messages, m, i, userInfo._id) ? 3 : 10,
              }}
            >
              <p>
                {m.content}
                <span style={{ fontSize: "10px", marginLeft: "5px" }}>
                  {formatTimeString(m.createdAt)}
                </span>
              </p>
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
