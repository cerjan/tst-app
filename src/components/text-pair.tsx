import React from "react";
import {Text} from "@mantine/core";

export const TextPair = ({children, description}: {children: React.ReactNode, description?: string}) => (
  <>
    <Text size={'sm'}>{children}</Text>
    {description && <Text size={'xs'} c={'dimmed'}>{description}</Text>}
  </>
)