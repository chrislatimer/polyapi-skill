Source: https://docs.polyapi.io/generated_sdks/java.html

# Java

## Install

First things first, let’s make sure the correct versions of Java and Maven are installed.

Head over here and install the Java and Maven versions listed:

[Versions](../versions.html)

Next, let’s create a totally new Maven project for testing.

```
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

Now, open the `pom.xml` file, delete its contents, and replace it with the following:

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>my-app</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <poly.version>0.15.1</poly.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>io.polyapi</groupId>
      <artifactId>library</artifactId>
      <version>${poly.version}</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <resources>
      <resource>
        <directory>target/generated-resources</directory>
      </resource>
    </resources>
    <plugins>
      <plugin>
        <groupId>io.polyapi</groupId>
        <artifactId>polyapi-maven-plugin</artifactId>
        <version>${poly.version}</version>
        <configuration>
          <host>{HOST}</host>
          <port>443</port>
          <apiKey>${env.POLY_API_KEY}</apiKey>
        </configuration>
        <executions>
          <execution>
            <phase>generate-sources</phase>
            <goals>
              <goal>generate-sources</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.12.1</version>
        <configuration>
          <parameters>true</parameters>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>build-helper-maven-plugin</artifactId>
        <version>3.2.0</version>
        <executions>
          <execution>
            <id>add-source</id>
            <phase>generate-sources</phase>
            <goals>
              <goal>add-source</goal>
            </goals>
            <configuration>
              <sources>
                <source>target/generated-sources</source>
              </sources>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

Next:

- Replace `{HOST}` with the server you’re connecting to (e.g. <https://na1.polyapi.io>)
- Create a new environment variable named `POLY_API_KEY` with its value as your api key.
  The code `{$env.POLY_API_KEY}` in the above example will pull from your api key from the environment.

Warning

The `pom.xml` file is generally checked into git. Be sure to not check in your api key. Instead, use an environment variable as shown above.

Then run this command to ensure the library is installed:

```
mvn clean compile
```

## Develop First Function

Next, let’s develop our first custom function!

In your project, create a new Java file named `Greetings.java` next to `App.java` in `./my-app/main/java/com/mycompany/app` with the following contents:

```
package com.mycompany.app;

import io.polyapi.commons.api.model.PolyServerFunction;

public class Greetings {

  @PolyServerFunction(context="greetings")
  public String hello(String name) {
    return String.format("Hello %s", name);
  }
}
```

Next use the PolyAPI Maven plugin to deploy this function:

```
mvn clean compile polyapi:deploy-functions
```

This will deploy a new server function to Poly. You can also instead use the `@PolyClientFunction` annotation instead of `@PolyServerFunction` to create functions which are packaged into the generated SDK.

## Run First Function

To generate the code invocation of an uploaded server function you need to compile the project once again:

```
$ mvn clean compile
```

Now let’s execute the function. Go back to your `App.java` file that was generated and replace its contents with the following:

```
package com.mycompany.app;

import io.polyapi.Poly;

public class App {

  public static void main(String[] args) {
    System.out.println(Poly.greetings.hello("Alice"));
  }
}
```

Note

Keep in mind that the Poly invocation follows the structure:

`Poly.[function context].[function name](...)`

To customize those values, the `@PolyServerFunction` or `@PolyClientFunction` annotations provide the `name` and `context` arguments.

We used the `context` argument `"greetings"` in the example above.

We did not specify a `name` argument, so by default the function name became the method name `hello`.

Finally run the java app with the following command:

```
mvn exec:java -Dexec.mainClass="com.mycompany.app.App" -Dexec.cleanupDaemonThreads=false
```

You should see the following output:

```
Hello Alice
```

Congratulations! You have successfully created and executed your first server function.

## Add Custom dependencies

To add custom dependencies to your project, modify the pom.xml file in the root of your project. You can add dependencies under the <dependencies> section.
For example let’s add Apache Commons Lang (a popular utility library) and implement StringUtils.capitalize() in our custom function:

First update pom.xml with the following:

```
<dependencies>
  <dependency>
    <groupId>org.example</groupId>
    <artifactId>my-custom-library</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

Next, update the hello function to use the StringUtils.capitalize() method.

```
package com.mycompany.app;

import org.apache.commons.lang3.StringUtils;

import io.polyapi.commons.api.model.PolyServerFunction;

public class Greetings {

  @PolyServerFunction(context="greetings")
  public String hello(String name) {
    return String.format("Hello %s", StringUtils.capitalize(name));
  }
}
```

Install the new dependency and redeploy the function:

```
mvn clean compile polyapi:deploy-functions
```

Let’s try it out with a different lowercase name in App.java:

```
package com.mycompany.app;

import io.polyapi.Poly;

public class App {

  public static void main(String[] args) {
    System.out.println(Poly.greetings.hello("bob"));
  }
}
```

Execute the function again:

```
mvn exec:java -Dexec.mainClass="com.mycompany.app.App" -Dexec.cleanupDaemonThreads=false
```

You should see the following output:

```
Hello Bob
```

Notice the capitalization of the name.
That’s it! You’ve successfully added a custom dependency and used it in your custom function.

## Onward

That’s it! You have now:

- Setup your Java SDK
- Trained your first server function
- Ran your first server function

This is the last step on the guided tour of Poly.

To further explore aspects of Poly and what it can do, head over to [Next Steps](../next_steps.html).
