import { Tag } from "@chakra-ui/react";
import { AccountRole } from "src/libs/apis/account";

type Props = {
  role: AccountRole;
}
export default function RoleTag(props: Props) {
  const { role } = props;
  if (role === AccountRole.NORMAL) return (
    <Tag colorScheme='blue' borderRadius='full'>
      {role}
    </Tag>
  );
  if (role === AccountRole.ADMIN) return (
    <Tag colorScheme='red' borderRadius='full'>
      {role}
    </Tag>
  );
  return (
    <Tag colorScheme='black' borderRadius='full'>
      unknown ({role})
    </Tag>
  );
}