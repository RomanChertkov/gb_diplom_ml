import Title from "antd/es/typography/Title";
import {Button, Form, Input, message, Space, Tag} from "antd";
import {DownloadOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useState} from "react";

export default function PageContent() {
    const [form] = Form.useForm()
    const [isFenchingTopics, setIsFetchingTopics] = useState(false)
    const [predictedTopics, setPredictedTopics] = useState<string[]>()
    const texts = Form.useWatch('texts', form)

    async function onFinish(values: { texts: string[] }) {
        await getTopics(values.texts)
        console.log(values)
    }

    async function getTopics(texts: string[]) {
        const baseApiUrl = 'http://http://b944bd293339.vps.myjino.ru/api'
        try {
            setIsFetchingTopics(true)
            const response = await fetch(baseApiUrl + '/get-topics', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(texts)
            })

            if (!response.ok) {
                message.error('возникла ошибка')
                return
            }

            const responseData = await response.json()
            setPredictedTopics(responseData.topics)

            message.success('Определение категорий завершено.')
        } catch (e: unknown) {
            if (e instanceof Error) {
                message.error('возникла неизвестная ошибка')
            }
        } finally {
            setIsFetchingTopics(false)
        }

    }


    const enableDownloadResultButton = texts && predictedTopics

    function downloadFile() {
        if (!enableDownloadResultButton){
            return
        }

        const data = predictedTopics.map(
            (item,index)=>`Категория: ${item} \n\n ${texts[index]}`
        )

        const a = document.createElement("a");
        const newsDivider = '\n\n ========================================\n\n'
        const file = new Blob([data.join(newsDivider)], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = "result.txt";
        a.click();
    }

    return (
        <>
            <Title>Определение категории новости</Title>
            <Form
                form={form}
                onFinish={onFinish}
            >
                <Form.List name="texts">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map(({key, name, ...restField}) => (
                                <Space key={key} style={{display: 'flex', marginBottom: 8,}} align="center">
                                    <Space direction={'vertical'} size={'small'}>
                                        <Space>
                                            <span>Категория новости: </span>
                                            {predictedTopics && predictedTopics[key] ? (
                                                    <Tag color={'geekblue'} style={{fontSize: 24, padding: 5}}>
                                                        {predictedTopics[key]}
                                                    </Tag>
                                                )
                                                : ('-')
                                            }
                                        </Space>


                                        <Form.Item
                                            {...restField}
                                            name={[key]}
                                            rules={[{required: true, message: 'Введите текст'}]}
                                        >
                                            <Input.TextArea
                                                rows={8}
                                                style={{width: 'calc(100vw - 200px)'}}
                                                placeholder={'Введите текст новости для определения категории'}
                                            />
                                        </Form.Item>
                                    </Space>


                                    <MinusCircleOutlined onClick={() => remove(name)}/>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                    Добавить текст
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
            <Space size={'large'}>
                <Button
                    onClick={() => form.submit()}
                    loading={isFenchingTopics}
                    type="primary"
                    size={"large"}
                    disabled={!texts}
                >
                    Определить категории
                </Button>
                <Button
                    onClick={() => {
                        form.resetFields()
                        setPredictedTopics([])
                    }}
                    size={"large"}
                    // disabled={true}
                >
                    Очистить форму
                </Button>
                <Button
                    icon={<DownloadOutlined/>}
                    size={"large"}
                    disabled={!enableDownloadResultButton}
                    onClick={downloadFile}
                >
                    Скачать файл с результатами
                </Button>
            </Space>

        </>
    )
}
